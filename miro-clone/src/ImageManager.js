import Cropper from 'cropperjs';
import cropperCss from 'cropperjs/dist/cropper.css?inline';

const UPLOADTHING_TOKEN = "eyJhcGlLZXkiOiJza19saXZlXzdkN2Y0NjlmMWNlZGEyZDk3MmYyNTNmZGUyMGY5ZWI3ZDlmYmI5ZjQ2NWUxYmY5NzMzZGNlODNmNzY5ZGZjNDEiLCJhcHBJZCI6IjA4cmx6Zjc4dHMiLCJyZWdpb25zIjpbInNlYTEiXX0=";
const PEXELS_API_KEY = "Ab2loXzMXv2MnCCEQmP9pRzOPA9NQhaHhk3gQn2h7AnjZ08vOAuQbQ25";

export class ImageManager {
  constructor(app) {
    this.app = app;
    this.cropperInstance = null;
    this.targetImageElement = null;

    // Inject Cropper CSS into Shadow DOM
    const style = document.createElement('style');
    style.textContent = cropperCss;
    this.app.shadowRoot.appendChild(style);

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.imageModal = this.app.shadowRoot.getElementById('image-modal-overlay');
    this.cropModal = this.app.shadowRoot.getElementById('crop-modal-overlay');
    this.closeImageModalBtn = this.app.shadowRoot.getElementById('close-image-modal');
    this.closeCropModalBtn = this.app.shadowRoot.getElementById('close-crop-modal');
    this.cancelCropBtn = this.app.shadowRoot.getElementById('cancel-crop-btn');
    this.confirmCropBtn = this.app.shadowRoot.getElementById('confirm-crop-btn');

    this.tabs = this.app.shadowRoot.querySelectorAll('.modal-tab');
    this.panes = this.app.shadowRoot.querySelectorAll('.tab-pane');

    this.pexelsSearchInput = this.app.shadowRoot.getElementById('pexels-search-input');
    this.pexelsSearchBtn = this.app.shadowRoot.getElementById('pexels-search-btn');
    this.pexelsGrid = this.app.shadowRoot.getElementById('pexels-grid');
    this.pexelsLoading = this.app.shadowRoot.getElementById('pexels-loading');

    this.uploadArea = this.app.shadowRoot.getElementById('upload-area');
    this.uploadInput = this.app.shadowRoot.getElementById('upload-file-input');
    this.uploadLoading = this.app.shadowRoot.getElementById('upload-loading');

    this.cropperImageTarget = this.app.shadowRoot.getElementById('cropper-image-target');
    this.cropLoading = this.app.shadowRoot.getElementById('crop-loading');
  }

  bindEvents() {
    this.closeImageModalBtn.addEventListener('click', () => this.hideImageModal());
    this.closeCropModalBtn.addEventListener('click', () => this.hideCropModal());
    this.cancelCropBtn.addEventListener('click', () => this.hideCropModal());

    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.tabs.forEach(t => t.classList.remove('active'));
        this.panes.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        this.app.shadowRoot.getElementById(tab.dataset.target).classList.add('active');
      });
    });

    this.pexelsSearchBtn.addEventListener('click', () => this.searchPexels());
    this.pexelsSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.searchPexels();
    });

    this.uploadArea.addEventListener('click', () => this.uploadInput.click());
    this.uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); this.uploadArea.classList.add('dragover'); });
    this.uploadArea.addEventListener('dragleave', () => this.uploadArea.classList.remove('dragover'));
    this.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.handleFileUpload(e.dataTransfer.files[0]);
      }
    });

    this.uploadInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleFileUpload(e.target.files[0]);
      }
    });

    this.confirmCropBtn.addEventListener('click', () => this.applyCrop());
  }

  showImageModal() {
    this.imageModal.classList.add('visible');
    // Default search if empty
    if (!this.pexelsGrid.hasChildNodes()) {
      this.searchPexels();
    }
  }

  hideImageModal() {
    this.imageModal.classList.remove('visible');
    // Reset tool back to select
    if (this.app.currentTool === 'image') {
      const selectBtn = this.app.shadowRoot.querySelector('.tool-btn[data-tool="select"]');
      if (selectBtn) selectBtn.click();
    }
  }

  async searchPexels() {
    const query = this.pexelsSearchInput.value.trim() || 'nature';
    this.pexelsLoading.classList.remove('hidden');
    this.pexelsGrid.innerHTML = '';

    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`, {
        headers: { Authorization: PEXELS_API_KEY }
      });
      const data = await res.json();
      
      data.photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.src.medium;
        img.dataset.largeUrl = photo.src.large;
        img.addEventListener('click', () => this.insertImageToBoard(photo.src.large));
        this.pexelsGrid.appendChild(img);
      });
    } catch (err) {
      console.error('Failed to fetch from Pexels', err);
      this.pexelsGrid.innerHTML = '<p>Erro ao carregar imagens.</p>';
    } finally {
      this.pexelsLoading.classList.add('hidden');
    }
  }

  async handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione uma imagem válida.');
      return;
    }

    this.uploadLoading.classList.remove('hidden');
    this.uploadArea.style.opacity = '0.5';
    this.uploadArea.style.pointerEvents = 'none';

    try {
      const uploadedUrl = await this.uploadToUploadThing(file);
      if (uploadedUrl) {
        this.insertImageToBoard(uploadedUrl);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Falha ao enviar imagem.');
    } finally {
      this.uploadLoading.classList.add('hidden');
      this.uploadArea.style.opacity = '1';
      this.uploadArea.style.pointerEvents = 'auto';
      this.uploadInput.value = '';
    }
  }

  async uploadToUploadThing(file) {
    const formData = new FormData();
    formData.append('files', file);

    const decoded = JSON.parse(atob(UPLOADTHING_TOKEN));

    const res = await fetch('https://uploadthing.com/api/uploadFiles', {
      method: 'POST',
      headers: {
        'x-uploadthing-api-key': decoded.apiKey,
        'x-uploadthing-version': '6.4.0'
      },
      body: formData
    });

    if (!res.ok) {
        // Fallback directly to v6 api
        const res2 = await fetch('https://api.uploadthing.com/v6/uploadFiles', {
            method: 'POST',
            headers: {
                'x-uploadthing-api-key': decoded.apiKey,
            },
            body: formData
        });
        if (!res2.ok) throw new Error('Upload failed');
        const data = await res2.json();
        return data[0]?.url || data[0]?.ufsUrl;
    }

    const data = await res.json();
    return data[0]?.url || data[0]?.ufsUrl;
  }

  insertImageToBoard(url) {
    this.hideImageModal();
    const rect = this.app.workspaceEl.getBoundingClientRect();
    const coords = this.app.workspaceManager.getWorkspaceCoords(rect.width / 2, rect.height / 2);
    
    const el = this.app.elementFactory.createElement('image', coords, { type: 'image', x: coords.x - 100, y: coords.y - 100, width: 200, height: 200, url });
    
    this.app.selectionManager.clearSelection();
    this.app.selectionManager.selectElement(el, false);
    const selectBtn = this.app.shadowRoot.querySelector('.tool-btn[data-tool="select"]');
    if (selectBtn) selectBtn.click();
  }

  showCropModal(imageElement) {
    this.targetImageElement = imageElement;
    const imgEl = imageElement.querySelector('img');
    if (!imgEl) return;

    this.cropperImageTarget.src = imgEl.src;
    this.cropModal.classList.add('visible');

    setTimeout(() => {
      if (this.cropperInstance) this.cropperInstance.destroy();
      this.cropperInstance = new Cropper(this.cropperImageTarget, {
        viewMode: 1,
        autoCropArea: 1,
        background: false,
      });
    }, 100);
  }

  hideCropModal() {
    this.cropModal.classList.remove('visible');
    if (this.cropperInstance) {
      this.cropperInstance.destroy();
      this.cropperInstance = null;
    }
    this.targetImageElement = null;
  }

  async applyCrop() {
    if (!this.cropperInstance || !this.targetImageElement) return;

    this.cropLoading.classList.remove('hidden');
    this.confirmCropBtn.disabled = true;

    try {
      const canvas = this.cropperInstance.getCroppedCanvas();
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      
      const file = new File([blob], 'cropped.png', { type: 'image/png' });
      const newUrl = await this.uploadToUploadThing(file);

      if (newUrl) {
        const imgEl = this.targetImageElement.querySelector('img');
        if (imgEl) imgEl.src = newUrl;
        
        const cropData = this.cropperInstance.getCropBoxData();
        if (cropData.width && cropData.height) {
            this.targetImageElement.style.width = cropData.width + 'px';
            this.targetImageElement.style.height = cropData.height + 'px';
        }
        
        this.app.saveBoardState();
      }
    } catch (err) {
      console.error('Crop upload failed', err);
      alert('Falha ao salvar o corte.');
    } finally {
      this.cropLoading.classList.add('hidden');
      this.confirmCropBtn.disabled = false;
      this.hideCropModal();
    }
  }
}
