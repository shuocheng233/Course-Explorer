function extractInfo(str) {
  const yearPattern = /(?<!\d)(20[0-2][0-9]|0[0-9]|1[0-9]|2[0-9])(?!\d)/
  const termPattern = /(spring|summer|fall|winter)|(?<![A-Za-z])(sp|su|fa|wi)(?![A-Za-z])/i
  const numberPattern = /(?<!\d)(\d{3,6})(?!\d)/
  const subjectPattern = /(?<!\[A-Za-z])([A-Za-z]{2,7})(?!\[A-Za-z])/

  const yearMatch = str.match(yearPattern)
  let year = yearMatch ? yearMatch[0] : null

  if (year) {
      str = str.replace(new RegExp(`\\b${year}\\b`, 'g'), "")
      year = year % 100 + 2000
  }

  const termMatch = str.match(termPattern)
  let term = termMatch ? termMatch[0] : null

  if (term) {
      str = str.replace(new RegExp(`\\b${term}\\b`, 'gi'), "")
      term = term.substring(0, 2).toLowerCase()
  }

  const courseMatch = str.match(numberPattern)
  let number = courseMatch ? courseMatch[0] : null

  const subjectMatch = str.match(subjectPattern)
  let subject = subjectMatch ? subjectMatch[0] : null

  if (subject) {
      subject = subject.toUpperCase()
  }

  return {
      year,
      term,
      number,
      subject
  }
}

export { extractInfo }