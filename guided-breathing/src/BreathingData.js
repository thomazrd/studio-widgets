export const breathingTechniques = [
  {
    id: 'square',
    name: 'Respiração Quadrada',
    description: 'Técnica de relaxamento que equilibra o sistema nervoso. Consiste em inspirar, reter com ar, expirar e reter sem ar, todos pelo mesmo tempo.',
    defaultPhases: [
      { name: 'Inspirar', duration: 4000, action: 'inhale' },
      { name: 'Segurar', duration: 4000, action: 'hold' },
      { name: 'Expirar', duration: 4000, action: 'exhale' },
      { name: 'Segurar', duration: 4000, action: 'hold' }
    ]
  },
  {
    id: '478',
    name: 'Respiração 4-7-8',
    description: 'Técnica tranquilizante que ajuda a adormecer e a reduzir a ansiedade. Inspira por 4, segura por 7, expira por 8.',
    defaultPhases: [
      { name: 'Inspirar', duration: 4000, action: 'inhale' },
      { name: 'Segurar', duration: 7000, action: 'hold' },
      { name: 'Expirar', duration: 8000, action: 'exhale' }
    ]
  },
  {
    id: 'diaphragmatic',
    name: 'Respiração Diafragmática',
    description: 'Respiração profunda pelo abdômen que reduz o estresse e melhora a oxigenação. Ritmo suave e contínuo.',
    defaultPhases: [
      { name: 'Inspirar', duration: 5000, action: 'inhale' },
      { name: 'Expirar', duration: 5000, action: 'exhale' }
    ]
  }
];
