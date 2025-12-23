// Mock API service for issue topics, departments, and heads of department

export interface IssueTopic {
  id: string;
  title: string;
  keywords: string[];
  department: string;
  departmentHead: string;
  departmentEmail: string;
  category: string;
  description: string;
}

// Mock database of issue topics
const issueTopicsDatabase: IssueTopic[] = [
  // Roads & Transport
  {
    id: 'rt_001',
    title: 'Pothole on road',
    keywords: ['pothole', 'road', 'hole', 'crack', 'damaged road', 'road damage'],
    department: 'Roads & Transport',
    departmentHead: 'John Mitchell',
    departmentEmail: 'roads@citycouncil.gov',
    category: 'roads',
    description: 'Report potholes and road surface damage',
  },
  {
    id: 'rt_002',
    title: 'Damaged pavement',
    keywords: ['pavement', 'sidewalk', 'footpath', 'cracked pavement', 'broken pavement'],
    department: 'Roads & Transport',
    departmentHead: 'John Mitchell',
    departmentEmail: 'roads@citycouncil.gov',
    category: 'roads',
    description: 'Report damaged or broken pavements',
  },
  {
    id: 'rt_003',
    title: 'Faded road markings',
    keywords: ['road markings', 'lines', 'faded lines', 'road lines', 'markings'],
    department: 'Roads & Transport',
    departmentHead: 'John Mitchell',
    departmentEmail: 'roads@citycouncil.gov',
    category: 'roads',
    description: 'Report faded or missing road markings',
  },
  {
    id: 'rt_004',
    title: 'Traffic light malfunction',
    keywords: ['traffic light', 'signal', 'broken light', 'traffic signal', 'lights not working'],
    department: 'Roads & Transport',
    departmentHead: 'John Mitchell',
    departmentEmail: 'roads@citycouncil.gov',
    category: 'roads',
    description: 'Report malfunctioning traffic lights',
  },
  {
    id: 'rt_005',
    title: 'Damaged road sign',
    keywords: ['road sign', 'sign', 'broken sign', 'missing sign', 'damaged sign'],
    department: 'Roads & Transport',
    departmentHead: 'John Mitchell',
    departmentEmail: 'roads@citycouncil.gov',
    category: 'roads',
    description: 'Report damaged or missing road signs',
  },

  // Waste Management
  {
    id: 'wm_001',
    title: 'Missed bin collection',
    keywords: ['missed bin', 'bin not collected', 'rubbish not collected', 'waste collection'],
    department: 'Waste Management',
    departmentHead: 'Sarah Thompson',
    departmentEmail: 'waste@citycouncil.gov',
    category: 'rubbish',
    description: 'Report missed bin collections',
  },
  {
    id: 'wm_002',
    title: 'Fly-tipping',
    keywords: ['fly-tipping', 'illegal dumping', 'dumped rubbish', 'waste dumped', 'dumping'],
    department: 'Waste Management',
    departmentHead: 'Sarah Thompson',
    departmentEmail: 'waste@citycouncil.gov',
    category: 'rubbish',
    description: 'Report illegally dumped waste',
  },
  {
    id: 'wm_003',
    title: 'Overflowing public bin',
    keywords: ['overflowing bin', 'full bin', 'public bin', 'street bin', 'litter bin'],
    department: 'Waste Management',
    departmentHead: 'Sarah Thompson',
    departmentEmail: 'waste@citycouncil.gov',
    category: 'rubbish',
    description: 'Report overflowing public waste bins',
  },
  {
    id: 'wm_004',
    title: 'Damaged wheelie bin',
    keywords: ['damaged bin', 'broken bin', 'wheelie bin', 'bin replacement', 'cracked bin'],
    department: 'Waste Management',
    departmentHead: 'Sarah Thompson',
    departmentEmail: 'waste@citycouncil.gov',
    category: 'rubbish',
    description: 'Report damaged or broken wheelie bins',
  },

  // Street Lighting
  {
    id: 'sl_001',
    title: 'Street light not working',
    keywords: ['street light', 'lamp', 'broken light', 'light not working', 'street lamp'],
    department: 'Street Lighting',
    departmentHead: 'David Clarke',
    departmentEmail: 'lighting@citycouncil.gov',
    category: 'lighting',
    description: 'Report non-working street lights',
  },
  {
    id: 'sl_002',
    title: 'Flickering street light',
    keywords: ['flickering light', 'flashing light', 'intermittent light', 'light flickering'],
    department: 'Street Lighting',
    departmentHead: 'David Clarke',
    departmentEmail: 'lighting@citycouncil.gov',
    category: 'lighting',
    description: 'Report flickering or flashing street lights',
  },
  {
    id: 'sl_003',
    title: 'Street light on during day',
    keywords: ['light on day', 'daytime light', 'light always on', 'wasting electricity'],
    department: 'Street Lighting',
    departmentHead: 'David Clarke',
    departmentEmail: 'lighting@citycouncil.gov',
    category: 'lighting',
    description: 'Report street lights that stay on during daytime',
  },

  // Parks & Recreation
  {
    id: 'pr_001',
    title: 'Overgrown grass',
    keywords: ['overgrown', 'long grass', 'unmowed grass', 'grass cutting', 'needs mowing'],
    department: 'Parks & Recreation',
    departmentHead: 'Emma Williams',
    departmentEmail: 'parks@citycouncil.gov',
    category: 'parks',
    description: 'Report overgrown grass in parks or public spaces',
  },
  {
    id: 'pr_002',
    title: 'Damaged park bench',
    keywords: ['broken bench', 'damaged bench', 'park bench', 'bench repair'],
    department: 'Parks & Recreation',
    departmentHead: 'Emma Williams',
    departmentEmail: 'parks@citycouncil.gov',
    category: 'parks',
    description: 'Report damaged or broken park benches',
  },
  {
    id: 'pr_003',
    title: 'Broken playground equipment',
    keywords: ['playground', 'broken equipment', 'damaged equipment', 'play area', 'swing broken'],
    department: 'Parks & Recreation',
    departmentHead: 'Emma Williams',
    departmentEmail: 'parks@citycouncil.gov',
    category: 'parks',
    description: 'Report broken or dangerous playground equipment',
  },
  {
    id: 'pr_004',
    title: 'Dead or dangerous tree',
    keywords: ['tree', 'dead tree', 'dangerous tree', 'fallen tree', 'tree removal'],
    department: 'Parks & Recreation',
    departmentHead: 'Emma Williams',
    departmentEmail: 'parks@citycouncil.gov',
    category: 'parks',
    description: 'Report dead, dangerous, or fallen trees',
  },

  // Environmental Health
  {
    id: 'eh_001',
    title: 'Noise complaint',
    keywords: ['noise', 'loud music', 'noise nuisance', 'disturbance', 'loud noise'],
    department: 'Environmental Health',
    departmentHead: 'Robert Harris',
    departmentEmail: 'environment@citycouncil.gov',
    category: 'noise',
    description: 'Report noise nuisance issues',
  },
  {
    id: 'eh_002',
    title: 'Air pollution',
    keywords: ['air pollution', 'smoke', 'fumes', 'smell', 'odor', 'bad smell'],
    department: 'Environmental Health',
    departmentHead: 'Robert Harris',
    departmentEmail: 'environment@citycouncil.gov',
    category: 'other',
    description: 'Report air quality or odor issues',
  },
  {
    id: 'eh_003',
    title: 'Pest infestation',
    keywords: ['pest', 'rats', 'mice', 'infestation', 'vermin', 'rodents'],
    department: 'Environmental Health',
    departmentHead: 'Robert Harris',
    departmentEmail: 'environment@citycouncil.gov',
    category: 'other',
    description: 'Report pest infestations',
  },

  // Community Safety
  {
    id: 'cs_001',
    title: 'Graffiti',
    keywords: ['graffiti', 'vandalism', 'spray paint', 'tagging'],
    department: 'Community Safety',
    departmentHead: 'Michael Brown',
    departmentEmail: 'safety@citycouncil.gov',
    category: 'graffiti',
    description: 'Report graffiti or vandalism',
  },
  {
    id: 'cs_002',
    title: 'Abandoned vehicle',
    keywords: ['abandoned car', 'abandoned vehicle', 'dumped car', 'untaxed vehicle'],
    department: 'Community Safety',
    departmentHead: 'Michael Brown',
    departmentEmail: 'safety@citycouncil.gov',
    category: 'parking',
    description: 'Report abandoned vehicles',
  },
  {
    id: 'cs_003',
    title: 'Illegal parking',
    keywords: ['illegal parking', 'blocked road', 'parking violation', 'parked on pavement'],
    department: 'Community Safety',
    departmentHead: 'Michael Brown',
    departmentEmail: 'safety@citycouncil.gov',
    category: 'parking',
    description: 'Report illegal parking',
  },

  // Housing & Buildings
  {
    id: 'hb_001',
    title: 'Dangerous building',
    keywords: ['dangerous building', 'unsafe building', 'collapsed wall', 'building damage'],
    department: 'Housing & Buildings',
    departmentHead: 'Lisa Anderson',
    departmentEmail: 'housing@citycouncil.gov',
    category: 'other',
    description: 'Report dangerous or unsafe buildings',
  },
  {
    id: 'hb_002',
    title: 'Scaffolding issue',
    keywords: ['scaffolding', 'unsafe scaffolding', 'scaffold', 'construction safety'],
    department: 'Housing & Buildings',
    departmentHead: 'Lisa Anderson',
    departmentEmail: 'housing@citycouncil.gov',
    category: 'other',
    description: 'Report unsafe scaffolding or construction sites',
  },

  // Drainage & Flooding
  {
    id: 'df_001',
    title: 'Blocked drain',
    keywords: ['blocked drain', 'drain', 'gully', 'drainage', 'flooding'],
    department: 'Drainage & Flooding',
    departmentHead: 'Peter Wilson',
    departmentEmail: 'drainage@citycouncil.gov',
    category: 'other',
    description: 'Report blocked drains or gullies',
  },
  {
    id: 'df_002',
    title: 'Flooding',
    keywords: ['flooding', 'flood', 'water on road', 'standing water', 'waterlogged'],
    department: 'Drainage & Flooding',
    departmentHead: 'Peter Wilson',
    departmentEmail: 'drainage@citycouncil.gov',
    category: 'other',
    description: 'Report flooding or standing water',
  },
  {
    id: 'df_003',
    title: 'Manhole cover issue',
    keywords: ['manhole', 'manhole cover', 'missing cover', 'broken cover', 'loose cover'],
    department: 'Drainage & Flooding',
    departmentHead: 'Peter Wilson',
    departmentEmail: 'drainage@citycouncil.gov',
    category: 'other',
    description: 'Report damaged or missing manhole covers',
  },
];

/**
 * Search for issue topics based on a query string
 * @param query - Search query entered by the user
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Array of matching issue topics
 */
export const searchIssueTopics = async (
  query: string,
  limit: number = 10
): Promise<IssueTopic[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchQuery = query.toLowerCase().trim();

  // Search through title and keywords
  const results = issueTopicsDatabase.filter((topic) => {
    const titleMatch = topic.title.toLowerCase().includes(searchQuery);
    const keywordMatch = topic.keywords.some((keyword) =>
      keyword.toLowerCase().includes(searchQuery)
    );
    const departmentMatch = topic.department.toLowerCase().includes(searchQuery);

    return titleMatch || keywordMatch || departmentMatch;
  });

  // Sort results by relevance (title matches first, then keyword matches)
  results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(searchQuery);
    const bTitleMatch = b.title.toLowerCase().includes(searchQuery);

    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;

    // If both match in title or both don't, sort alphabetically
    return a.title.localeCompare(b.title);
  });

  return results.slice(0, limit);
};

/**
 * Get all issue topics for a specific category
 * @param category - Category key
 * @returns Array of issue topics in that category
 */
export const getIssueTopicsByCategory = async (
  category: string
): Promise<IssueTopic[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return issueTopicsDatabase.filter((topic) => topic.category === category);
};

/**
 * Get a specific issue topic by ID
 * @param id - Issue topic ID
 * @returns Issue topic or undefined if not found
 */
export const getIssueTopicById = async (
  id: string
): Promise<IssueTopic | undefined> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return issueTopicsDatabase.find((topic) => topic.id === id);
};

/**
 * Get all departments
 * @returns Array of unique departments with their heads
 */
export const getAllDepartments = async (): Promise<
  Array<{
    name: string;
    head: string;
    email: string;
  }>
> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const departments = new Map<string, { name: string; head: string; email: string }>();

  issueTopicsDatabase.forEach((topic) => {
    if (!departments.has(topic.department)) {
      departments.set(topic.department, {
        name: topic.department,
        head: topic.departmentHead,
        email: topic.departmentEmail,
      });
    }
  });

  return Array.from(departments.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};
