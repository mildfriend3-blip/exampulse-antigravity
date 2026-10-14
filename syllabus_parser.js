// syllabus_parser.js

/**
 * Parses raw text or structured syllabus content into units, topics, and course metadata.
 */
function parseSyllabus(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      success: false,
      error: 'Empty or invalid syllabus text',
      units: [],
      courseInfo: {}
    };
  }

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  // Extract course code and title if present
  let courseCode = 'CYB-COURSE';
  let courseTitle = 'Engineering Syllabus';
  let semester = null;
  let credits = null;

  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const line = lines[i];
    const codeMatch = line.match(/\b([A-Z]{2,4}[-\s]?\d{3}[A-Z]?)\b/i);
    if (codeMatch && courseCode === 'CYB-COURSE') {
      courseCode = codeMatch[1].toUpperCase();
    }
    const semMatch = line.match(/Semester\s*[:\-]?\s*([1-8IVX]+)/i);
    if (semMatch && !semester) {
      semester = semMatch[1];
    }
    const credMatch = line.match(/Credits?\s*[:\-]?\s*(\d+)/i);
    if (credMatch && !credits) {
      credits = parseInt(credMatch[1], 10);
    }
    if (/Course\s*Title|Subject\s*[:\-]/i.test(line)) {
      courseTitle = line.replace(/Course\s*Title|Subject\s*[:\-]/i, '').trim();
    }
  }

  // Parse units / modules
  const units = [];
  let currentUnit = null;

  lines.forEach(line => {
    const unitMatch = line.match(/^(?:Unit|Module|Section)\s*([0-9IVX]+)\s*[:\-–\.]?\s*(.*)/i);
    if (unitMatch) {
      if (currentUnit) {
        units.push(currentUnit);
      }
      currentUnit = {
        number: unitMatch[1],
        title: unitMatch[2] ? unitMatch[2].trim() : `Unit ${unitMatch[1]}`,
        topics: []
      };
    } else if (currentUnit) {
      // Add topics under current unit
      if (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
        currentUnit.topics.push(line.replace(/^[-*\d\.\s]+/, '').trim());
      } else if (line.includes(',') || line.includes(';')) {
        const parts = line.split(/[,;]/).map(p => p.trim()).filter(p => p.length > 2);
        currentUnit.topics.push(...parts);
      } else if (line.length > 3 && !/Textbooks|Reference|Books/i.test(line)) {
        currentUnit.topics.push(line);
      }
    }
  });

  if (currentUnit) {
    units.push(currentUnit);
  }

  // Fallback if no explicit "Unit X" tags were found
  if (units.length === 0) {
    units.push({
      number: "1",
      title: "Core Concepts & Fundamentals",
      topics: lines.slice(0, Math.ceil(lines.length / 2))
    });
    units.push({
      number: "2",
      title: "Advanced Topics & Applications",
      topics: lines.slice(Math.ceil(lines.length / 2))
    });
  }

  return {
    success: true,
    courseInfo: {
      courseCode,
      courseTitle,
      semester,
      credits
    },
    totalUnits: units.length,
    units,
    rawText
  };
}

module.exports = {
  parseSyllabus
};
