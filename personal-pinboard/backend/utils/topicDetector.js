export const TOPIC_DEFINITIONS = [
  {
    id: 'architecture',
    label: 'Architecture & Spaces',
    category_id: 2,
    keywords: [
      'architect', 'interior', 'concrete', 'pavilion', 'dwelling', 'room',
      'house', 'villa', 'living', 'decor', 'building', 'space', 'spaces',
      'brutalist', 'monolithic', 'courtyard', 'furniture', 'credenza',
      'apartment', 'studio', 'facade', 'structure', 'skylight', 'minimalist'
    ],
  },
  {
    id: 'code',
    label: 'Study & Tech',
    category_id: 1,
    keywords: [
      'code', 'coding', 'programming', 'c++', 'react', 'javascript', 'python',
      'typescript', 'software', 'developer', 'algorithm', 'system', 'terminal',
      'backend', 'frontend', 'git', 'api', 'server', 'linux', 'data structure'
    ],
  },
  {
    id: 'workspaces',
    label: 'Workspaces',
    category_id: 3,
    keywords: [
      'tech', 'setup', 'workspace', 'desk', 'monitor', 'keyboard', 'hardware',
      'mechanical', 'ultrawide', 'ergonomic', 'pc', 'apple', 'gadget',
      'workstation', 'cyberpunk', 'gaming', 'battlestation', 'screen'
    ],
  },
];

export const detectPinTopic = (title = '', description = '', tags = []) => {
  const corpus = [
    String(title || ''),
    String(description || ''),
    Array.isArray(tags) ? tags.join(' ') : String(tags || ''),
  ].join(' ').toLowerCase();

  let matchedTopic = null;
  let highestScore = 0;

  for (const topic of TOPIC_DEFINITIONS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (corpus.includes(kw)) {
        score += corpus.includes(title.toLowerCase()) ? 3 : 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      matchedTopic = topic;
    }
  }

  return matchedTopic || { id: 'general', label: 'General Inspiration', category_id: 1 };
};

export default {
  TOPIC_DEFINITIONS,
  detectPinTopic,
};
