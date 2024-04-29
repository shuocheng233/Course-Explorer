function extractInfo(str) {
    const yearPattern = /(?<!\d)(20[0-2][0-9]|0[0-9]|1[0-9]|2[0-9])(?!\d)/
    const termPattern = /(spring|summer|fall|winter)|(?<![A-Za-z])(sp|su|fa|wi)(?![A-Za-z])/i
    const numberPattern = /(?<!\d)(\d{3,6})(?!\d)/
    const subjectPattern = /(?<!\[A-Za-z])([A-Za-z]{2,7})(?!\[A-Za-z])/
  
    const yearMatch = str.match(yearPattern)
    const year = yearMatch ? yearMatch[0] % 100 + 2000 : null
  
    if (year) {
      str = str.replace(year, "")
    }
  
    const termMatch = str.match(termPattern)
    const term = termMatch ? termMatch[0].substring(0, 2) : null
  
    if (term) {
      str = str.replace(term, "")
    }
  
    const courseMatch = str.match(numberPattern)
    const number = courseMatch ? courseMatch[0] : null
  
    const subjectMatch = str.match(subjectPattern)
    const subject = subjectMatch ? subjectMatch[0] : null

    return {
      year,
      term,
      number,
      subject
    }
}

export { extractInfo }