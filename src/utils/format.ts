export const pad = (n: number): string => String(n).padStart(2, '0')

export const formatDate = (d: Date | null): string => {
  if (!d) return ''
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export const DIAS: string[] = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]
