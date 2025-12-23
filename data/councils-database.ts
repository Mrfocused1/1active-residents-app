// UK Councils Database
// Static data for all UK councils with department information
// No API calls needed - all data is local and instant

export interface CouncilDepartment {
  name: string;
  head: string;
  phone: string;
  email: string;
  categories: string[];
}

export interface CouncilLeadership {
  councilLeader: {
    name: string;
    party: string;
    role: string;
    email: string;
  };
  chiefExecutive: {
    name: string;
    role: string;
    email: string;
  };
}

export interface RSSFeed {
  url: string;
  type: string;
}

export interface CouncilInfo {
  name: string;
  website: string;
  phone: string;
  region: string;
  type: string;
  rssFeeds: RSSFeed[];
  leadership: CouncilLeadership;
  departments: {
    [key: string]: CouncilDepartment;
  };
}

export type CouncilsDatabase = {
  [councilName: string]: CouncilInfo;
};

export const councilsDatabase: CouncilsDatabase = {
  Camden: {
    name: 'London Borough of Camden',
    website: 'https://www.camden.gov.uk',
    phone: '020 7974 4444',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://news.camden.gov.uk/feed/',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Georgia Gould',
        party: 'Labour',
        role: 'Leader of Camden Council',
        email: 'georgia.gould@camden.gov.uk',
      },
      chiefExecutive: {
        name: 'Meena Kishinani',
        role: 'Chief Executive',
        email: 'chiefexecutive@camden.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Director of Highways and Transport',
        phone: '020 7974 4444',
        email: 'highways@camden.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights', 'road markings', 'street signs'],
      },
      waste: {
        name: 'Waste and Recycling Services',
        head: 'Waste Services Manager',
        phone: '020 7974 1234',
        email: 'recycling@camden.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'missed collection', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 7974 1111',
        email: 'parks@camden.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds', 'grass cutting', 'hedges'],
      },
      housing: {
        name: 'Housing Services',
        head: 'Director of Housing',
        phone: '020 7974 4444',
        email: 'housing@camden.gov.uk',
        categories: ['housing repairs', 'council housing', 'estate maintenance'],
      },
    },
  },
  Westminster: {
    name: 'City of Westminster',
    website: 'https://www.westminster.gov.uk',
    phone: '020 7641 6000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.westminster.gov.uk/news/rss.xml',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Adam Hug',
        party: 'Labour',
        role: 'Leader of Westminster City Council',
        email: 'ahug@westminster.gov.uk',
      },
      chiefExecutive: {
        name: 'Stuart Love',
        role: 'Chief Executive',
        email: 'chiefexecutive@westminster.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Director of City Highways',
        phone: '020 7641 2000',
        email: 'highways@westminster.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights', 'road markings'],
      },
      waste: {
        name: 'Waste and Street Environment',
        head: 'Waste Services Director',
        phone: '020 7641 7950',
        email: 'waste@westminster.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Green Spaces',
        head: 'Parks Manager',
        phone: '020 7641 2814',
        email: 'parks@westminster.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds', 'grass cutting'],
      },
    },
  },
  Islington: {
    name: 'London Borough of Islington',
    website: 'https://www.islington.gov.uk',
    phone: '020 7527 2000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.islington.gov.uk/rss.xml',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Kaya Comer-Schwartz',
        party: 'Labour',
        role: 'Leader of Islington Council',
        email: 'kaya.comer-schwartz@islington.gov.uk',
      },
      chiefExecutive: {
        name: 'Zina Etheridge',
        role: 'Chief Executive',
        email: 'chiefexecutive@islington.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transportation',
        head: 'Highways Manager',
        phone: '020 7527 2000',
        email: 'highways@islington.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Operations Manager',
        phone: '020 7527 2000',
        email: 'recycling@islington.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'missed collection'],
      },
      parks: {
        name: 'Parks and Leisure',
        head: 'Parks Manager',
        phone: '020 7527 2000',
        email: 'parks@islington.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Hackney: {
    name: 'London Borough of Hackney',
    website: 'https://www.hackney.gov.uk',
    phone: '020 8356 5000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://news.hackney.gov.uk/feed/',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Caroline Woodley',
        party: 'Labour',
        role: 'Mayor of Hackney',
        email: 'caroline.woodley@hackney.gov.uk',
      },
      chiefExecutive: {
        name: 'Dawn Cafferty',
        role: 'Chief Executive',
        email: 'chiefexecutive@hackney.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8356 8428',
        email: 'highways@hackney.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8356 6688',
        email: 'waste@hackney.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Green Spaces',
        head: 'Parks Service Manager',
        phone: '020 8356 3000',
        email: 'parks@hackney.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Bromley: {
    name: 'London Borough of Bromley',
    website: 'https://www.bromley.gov.uk',
    phone: '020 8464 3333',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.bromley.gov.uk/news/rss.xml',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Colin Smith',
        party: 'Conservative',
        role: 'Leader of Bromley Council',
        email: 'colin.smith@bromley.gov.uk',
      },
      chiefExecutive: {
        name: 'Ade Adetosoye',
        role: 'Chief Executive',
        email: 'chiefexecutive@bromley.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Traffic Management',
        head: 'Highways Manager',
        phone: '020 8464 3333',
        email: 'highways@bromley.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Environment and Waste',
        head: 'Waste Services Manager',
        phone: '020 8464 3333',
        email: 'waste@bromley.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Countryside',
        head: 'Parks Manager',
        phone: '020 8464 3333',
        email: 'parks@bromley.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Southwark: {
    name: 'London Borough of Southwark',
    website: 'https://www.southwark.gov.uk',
    phone: '020 7525 5000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.southwark.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Kieron Williams',
        party: 'Labour',
        role: 'Leader of Southwark Council',
        email: 'kieron.williams@southwark.gov.uk',
      },
      chiefExecutive: {
        name: 'Althea Loderick',
        role: 'Chief Executive',
        email: 'chiefexecutive@southwark.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 7525 2000',
        email: 'highways@southwark.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Cleansing',
        head: 'Waste Manager',
        phone: '020 7525 2000',
        email: 'waste@southwark.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Leisure',
        head: 'Parks Manager',
        phone: '020 7525 2000',
        email: 'parks@southwark.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Buckinghamshire: {
    name: 'Buckinghamshire Council',
    website: 'https://www.buckinghamshire.gov.uk',
    phone: '01296 395000',
    region: 'South East England',
    type: 'Unitary Authority',
    rssFeeds: [
      {
        url: 'https://www.buckinghamshire.gov.uk/news/rss.xml',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Martin Tett',
        party: 'Conservative',
        role: 'Leader of Buckinghamshire Council',
        email: 'martin.tett@buckinghamshire.gov.uk',
      },
      chiefExecutive: {
        name: 'Rachael Shimmin',
        role: 'Chief Executive',
        email: 'chiefexecutive@buckinghamshire.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Transport and Highways',
        head: 'Highways Manager',
        phone: '01296 382416',
        email: 'transport@buckinghamshire.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '01296 395000',
        email: 'waste@buckinghamshire.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      environment: {
        name: 'Environment and Climate Change',
        head: 'Environment Manager',
        phone: '01296 395000',
        email: 'environment@buckinghamshire.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'countryside'],
      },
    },
  },
  Oxfordshire: {
    name: 'Oxfordshire County Council',
    website: 'https://www.oxfordshire.gov.uk',
    phone: '01865 792422',
    region: 'South East England',
    type: 'County Council',
    rssFeeds: [
      {
        url: 'https://news.oxfordshire.gov.uk/feed/',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Liz Leffman',
        party: 'Liberal Democrat',
        role: 'Leader of Oxfordshire County Council',
        email: 'liz.leffman@oxfordshire.gov.uk',
      },
      chiefExecutive: {
        name: 'Giles Perritt',
        role: 'Chief Executive',
        email: 'chiefexecutive@oxfordshire.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '0345 310 1111',
        email: 'highways@oxfordshire.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste Management',
        head: 'Waste Manager',
        phone: '01865 815000',
        email: 'waste@oxfordshire.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      environment: {
        name: 'Environment and Place',
        head: 'Environment Manager',
        phone: '01865 792422',
        email: 'environment@oxfordshire.gov.uk',
        categories: ['trees', 'graffiti', 'parks'],
      },
    },
  },
  'West Northamptonshire': {
    name: 'West Northamptonshire Council',
    website: 'https://www.westnorthants.gov.uk',
    phone: '0300 126 7000',
    region: 'East Midlands',
    type: 'Unitary Authority',
    rssFeeds: [
      {
        url: 'https://www.westnorthants.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Jonathan Nunn',
        party: 'Conservative',
        role: 'Leader of West Northamptonshire Council',
        email: 'jonathan.nunn@westnorthants.gov.uk',
      },
      chiefExecutive: {
        name: 'Anna Earnshaw',
        role: 'Chief Executive',
        email: 'chiefexecutive@westnorthants.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '0300 126 1000',
        email: 'highways@westnorthants.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '0300 126 7000',
        email: 'waste@westnorthants.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      environment: {
        name: 'Environment Services',
        head: 'Environment Manager',
        phone: '0300 126 7000',
        email: 'environment@westnorthants.gov.uk',
        categories: ['trees', 'graffiti', 'parks'],
      },
    },
  },
  Lambeth: {
    name: 'London Borough of Lambeth',
    website: 'https://www.lambeth.gov.uk',
    phone: '020 7926 1000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Claire Holland',
        party: 'Labour',
        role: 'Leader of Lambeth Council',
        email: 'leader@lambeth.gov.uk',
      },
      chiefExecutive: {
        name: 'Bayo Dosunmu',
        role: 'Chief Executive',
        email: 'chiefexecutive@lambeth.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Director of Highways and Transport',
        phone: '020 7926 1000',
        email: 'highways@lambeth.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights', 'road markings'],
      },
      waste: {
        name: 'Waste and Recycling Services',
        head: 'Director of Waste Services',
        phone: '020 7926 1000',
        email: 'waste@lambeth.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'missed collections'],
      },
      parks: {
        name: 'Parks and Green Spaces',
        head: 'Director of Parks',
        phone: '020 7926 1000',
        email: 'parks@lambeth.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
      housing: {
        name: 'Housing and Environment',
        head: 'Director of Housing',
        phone: '020 7926 1000',
        email: 'housing@lambeth.gov.uk',
        categories: ['noise', 'anti-social behaviour', 'housing repairs'],
      },
    },
  },
  'Barking and Dagenham': {
    name: 'London Borough of Barking and Dagenham',
    website: 'https://www.lbbd.gov.uk',
    phone: '020 8215 3000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Darren Rodwell',
        party: 'Labour',
        role: 'Leader of Barking and Dagenham Council',
        email: 'leader@lbbd.gov.uk',
      },
      chiefExecutive: {
        name: 'Fiona Taylor',
        role: 'Chief Executive',
        email: 'chiefexecutive@lbbd.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Engineering',
        head: 'Highways Manager',
        phone: '020 8215 3000',
        email: 'highways@lbbd.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8215 3000',
        email: 'waste@lbbd.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Environment',
        head: 'Parks Manager',
        phone: '020 8215 3000',
        email: 'parks@lbbd.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Barnet: {
    name: 'London Borough of Barnet',
    website: 'https://www.barnet.gov.uk',
    phone: '020 8359 2000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.barnet.gov.uk/news/rss.xml',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Barry Rawlings',
        party: 'Labour',
        role: 'Leader of Barnet Council',
        email: 'barry.rawlings@barnet.gov.uk',
      },
      chiefExecutive: {
        name: 'Andrew Charlwood',
        role: 'Chief Executive',
        email: 'chiefexecutive@barnet.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transportation',
        head: 'Highways Manager',
        phone: '020 8359 2000',
        email: 'highways@barnet.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8359 2000',
        email: 'waste@barnet.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8359 2000',
        email: 'parks@barnet.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Bexley: {
    name: 'London Borough of Bexley',
    website: 'https://www.bexley.gov.uk',
    phone: '020 8303 7777',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Teresa O\'Neill',
        party: 'Conservative',
        role: 'Leader of Bexley Council',
        email: 'teresa.oneill@bexley.gov.uk',
      },
      chiefExecutive: {
        name: 'Jackie Belton',
        role: 'Chief Executive',
        email: 'chiefexecutive@bexley.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8303 7777',
        email: 'highways@bexley.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8303 7777',
        email: 'waste@bexley.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Countryside',
        head: 'Parks Manager',
        phone: '020 8303 7777',
        email: 'parks@bexley.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Brent: {
    name: 'London Borough of Brent',
    website: 'https://www.brent.gov.uk',
    phone: '020 8937 1234',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.brent.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Muhammed Butt',
        party: 'Labour',
        role: 'Leader of Brent Council',
        email: 'muhammed.butt@brent.gov.uk',
      },
      chiefExecutive: {
        name: 'Carolyn Downs',
        role: 'Chief Executive',
        email: 'chiefexecutive@brent.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Infrastructure',
        head: 'Highways Manager',
        phone: '020 8937 5050',
        email: 'highways@brent.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8937 5050',
        email: 'waste@brent.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8937 5050',
        email: 'parks@brent.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Croydon: {
    name: 'London Borough of Croydon',
    website: 'https://www.croydon.gov.uk',
    phone: '020 8726 6000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Jason Perry',
        party: 'Conservative',
        role: 'Executive Mayor of Croydon',
        email: 'jason.perry@croydon.gov.uk',
      },
      chiefExecutive: {
        name: 'Katherine Kerswell',
        role: 'Chief Executive',
        email: 'chiefexecutive@croydon.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8726 6000',
        email: 'highways@croydon.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8726 6000',
        email: 'waste@croydon.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8726 6000',
        email: 'parks@croydon.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Ealing: {
    name: 'London Borough of Ealing',
    website: 'https://www.ealing.gov.uk',
    phone: '020 8825 5000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.ealing.gov.uk/news/rss.xml',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Peter Mason',
        party: 'Labour',
        role: 'Leader of Ealing Council',
        email: 'peter.mason@ealing.gov.uk',
      },
      chiefExecutive: {
        name: 'Tony Clements',
        role: 'Chief Executive',
        email: 'chiefexecutive@ealing.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8825 6600',
        email: 'highways@ealing.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8825 6000',
        email: 'waste@ealing.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Leisure',
        head: 'Parks Manager',
        phone: '020 8825 6600',
        email: 'parks@ealing.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Enfield: {
    name: 'London Borough of Enfield',
    website: 'https://www.enfield.gov.uk',
    phone: '020 8379 1000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.enfield.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Nesil Caliskan',
        party: 'Labour',
        role: 'Leader of Enfield Council',
        email: 'nesil.caliskan@enfield.gov.uk',
      },
      chiefExecutive: {
        name: 'Terry Osborne',
        role: 'Chief Executive',
        email: 'chiefexecutive@enfield.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transportation',
        head: 'Highways Manager',
        phone: '020 8379 1000',
        email: 'highways@enfield.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Street Scene',
        head: 'Waste Manager',
        phone: '020 8379 1000',
        email: 'waste@enfield.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8379 1000',
        email: 'parks@enfield.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Greenwich: {
    name: 'Royal Borough of Greenwich',
    website: 'https://www.royalgreenwich.gov.uk',
    phone: '020 8854 8888',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.royalgreenwich.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Anthony Okereke',
        party: 'Labour',
        role: 'Leader of Greenwich Council',
        email: 'anthony.okereke@royalgreenwich.gov.uk',
      },
      chiefExecutive: {
        name: 'Debbie Warren',
        role: 'Chief Executive',
        email: 'chiefexecutive@royalgreenwich.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8854 8888',
        email: 'highways@royalgreenwich.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8854 8888',
        email: 'waste@royalgreenwich.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8854 8888',
        email: 'parks@royalgreenwich.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  'Hammersmith and Fulham': {
    name: 'London Borough of Hammersmith and Fulham',
    website: 'https://www.lbhf.gov.uk',
    phone: '020 8748 3020',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.lbhf.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Stephen Cowan',
        party: 'Labour',
        role: 'Leader of Hammersmith and Fulham Council',
        email: 'stephen.cowan@lbhf.gov.uk',
      },
      chiefExecutive: {
        name: 'Kim Dero',
        role: 'Chief Executive',
        email: 'chiefexecutive@lbhf.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8748 3020',
        email: 'highways@lbhf.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8748 3020',
        email: 'waste@lbhf.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8748 3020',
        email: 'parks@lbhf.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Haringey: {
    name: 'London Borough of Haringey',
    website: 'https://www.haringey.gov.uk',
    phone: '020 8489 0000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.haringey.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Peray Ahmet',
        party: 'Labour',
        role: 'Leader of Haringey Council',
        email: 'peray.ahmet@haringey.gov.uk',
      },
      chiefExecutive: {
        name: 'Zina Etheridge',
        role: 'Chief Executive',
        email: 'chiefexecutive@haringey.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transportation',
        head: 'Highways Manager',
        phone: '020 8489 0000',
        email: 'highways@haringey.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Street Scene',
        head: 'Waste Manager',
        phone: '020 8489 0000',
        email: 'waste@haringey.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Leisure',
        head: 'Parks Manager',
        phone: '020 8489 0000',
        email: 'parks@haringey.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Harrow: {
    name: 'London Borough of Harrow',
    website: 'https://www.harrow.gov.uk',
    phone: '020 8863 5611',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Paul Osborn',
        party: 'Conservative',
        role: 'Leader of Harrow Council',
        email: 'paul.osborn@harrow.gov.uk',
      },
      chiefExecutive: {
        name: 'Charlie Stewart',
        role: 'Chief Executive',
        email: 'chiefexecutive@harrow.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8863 5611',
        email: 'highways@harrow.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8863 5611',
        email: 'waste@harrow.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8863 5611',
        email: 'parks@harrow.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Havering: {
    name: 'London Borough of Havering',
    website: 'https://www.havering.gov.uk',
    phone: '01708 434343',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Ray Morgon',
        party: 'Havering Residents Association',
        role: 'Leader of Havering Council',
        email: 'ray.morgon@havering.gov.uk',
      },
      chiefExecutive: {
        name: 'Andrew Blake-Herbert',
        role: 'Chief Executive',
        email: 'chiefexecutive@havering.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '01708 434343',
        email: 'highways@havering.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '01708 434343',
        email: 'waste@havering.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Countryside',
        head: 'Parks Manager',
        phone: '01708 434343',
        email: 'parks@havering.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Hillingdon: {
    name: 'London Borough of Hillingdon',
    website: 'https://www.hillingdon.gov.uk',
    phone: '01895 250111',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.hillingdon.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Ian Edwards',
        party: 'Conservative',
        role: 'Leader of Hillingdon Council',
        email: 'ian.edwards@hillingdon.gov.uk',
      },
      chiefExecutive: {
        name: 'Kevin Byrne',
        role: 'Chief Executive',
        email: 'chiefexecutive@hillingdon.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '01895 250111',
        email: 'highways@hillingdon.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '01895 250111',
        email: 'waste@hillingdon.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '01895 250111',
        email: 'parks@hillingdon.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Hounslow: {
    name: 'London Borough of Hounslow',
    website: 'https://www.hounslow.gov.uk',
    phone: '020 8583 2000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Shantanu Rajawat',
        party: 'Labour',
        role: 'Leader of Hounslow Council',
        email: 'shantanu.rajawat@hounslow.gov.uk',
      },
      chiefExecutive: {
        name: 'Niall Bolger',
        role: 'Chief Executive',
        email: 'chiefexecutive@hounslow.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8583 2000',
        email: 'highways@hounslow.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8583 2000',
        email: 'waste@hounslow.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8583 2000',
        email: 'parks@hounslow.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  'Kensington and Chelsea': {
    name: 'Royal Borough of Kensington and Chelsea',
    website: 'https://www.rbkc.gov.uk',
    phone: '020 7361 3000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.rbkc.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Elizabeth Campbell',
        party: 'Conservative',
        role: 'Leader of Kensington and Chelsea Council',
        email: 'elizabeth.campbell@rbkc.gov.uk',
      },
      chiefExecutive: {
        name: 'Barry Quirk',
        role: 'Chief Executive',
        email: 'chiefexecutive@rbkc.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 7361 3000',
        email: 'highways@rbkc.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 7361 3000',
        email: 'waste@rbkc.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 7361 3000',
        email: 'parks@rbkc.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  'Kingston upon Thames': {
    name: 'Royal Borough of Kingston upon Thames',
    website: 'https://www.kingston.gov.uk',
    phone: '020 8547 5000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Andreas Kirsch',
        party: 'Liberal Democrat',
        role: 'Leader of Kingston Council',
        email: 'andreas.kirsch@kingston.gov.uk',
      },
      chiefExecutive: {
        name: 'Charlie Adan',
        role: 'Chief Executive',
        email: 'chiefexecutive@kingston.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8547 5000',
        email: 'highways@kingston.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8547 5000',
        email: 'waste@kingston.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8547 5000',
        email: 'parks@kingston.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Lewisham: {
    name: 'London Borough of Lewisham',
    website: 'https://www.lewisham.gov.uk',
    phone: '020 8314 6000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://lewisham.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Brenda Dacres',
        party: 'Labour',
        role: 'Mayor of Lewisham',
        email: 'brenda.dacres@lewisham.gov.uk',
      },
      chiefExecutive: {
        name: 'Kath Nicholson',
        role: 'Chief Executive',
        email: 'chiefexecutive@lewisham.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8314 6000',
        email: 'highways@lewisham.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8314 6000',
        email: 'waste@lewisham.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8314 6000',
        email: 'parks@lewisham.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Merton: {
    name: 'London Borough of Merton',
    website: 'https://www.merton.gov.uk',
    phone: '020 8274 4901',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.merton.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Ross Garrod',
        party: 'Labour',
        role: 'Leader of Merton Council',
        email: 'ross.garrod@merton.gov.uk',
      },
      chiefExecutive: {
        name: 'Hannah Doody',
        role: 'Chief Executive',
        email: 'chiefexecutive@merton.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8274 4901',
        email: 'highways@merton.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8274 4901',
        email: 'waste@merton.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Greenspaces',
        head: 'Parks Manager',
        phone: '020 8274 4901',
        email: 'parks@merton.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Newham: {
    name: 'London Borough of Newham',
    website: 'https://www.newham.gov.uk',
    phone: '020 8430 2000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.newham.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Rokhsana Fiaz',
        party: 'Labour',
        role: 'Mayor of Newham',
        email: 'rokhsana.fiaz@newham.gov.uk',
      },
      chiefExecutive: {
        name: 'Clive Grimshaw',
        role: 'Chief Executive',
        email: 'chiefexecutive@newham.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8430 2000',
        email: 'highways@newham.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8430 2000',
        email: 'waste@newham.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8430 2000',
        email: 'parks@newham.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Redbridge: {
    name: 'London Borough of Redbridge',
    website: 'https://www.redbridge.gov.uk',
    phone: '020 8554 5000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Jas Athwal',
        party: 'Labour',
        role: 'Leader of Redbridge Council',
        email: 'jas.athwal@redbridge.gov.uk',
      },
      chiefExecutive: {
        name: 'Andy Donald',
        role: 'Chief Executive',
        email: 'chiefexecutive@redbridge.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8554 5000',
        email: 'highways@redbridge.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8554 5000',
        email: 'waste@redbridge.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8554 5000',
        email: 'parks@redbridge.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  'Richmond upon Thames': {
    name: 'London Borough of Richmond upon Thames',
    website: 'https://www.richmond.gov.uk',
    phone: '020 8891 1411',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Gareth Roberts',
        party: 'Liberal Democrat',
        role: 'Leader of Richmond Council',
        email: 'gareth.roberts@richmond.gov.uk',
      },
      chiefExecutive: {
        name: 'Alasdair Smith',
        role: 'Chief Executive',
        email: 'chiefexecutive@richmond.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8891 1411',
        email: 'highways@richmond.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8891 1411',
        email: 'waste@richmond.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8891 1411',
        email: 'parks@richmond.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Sutton: {
    name: 'London Borough of Sutton',
    website: 'https://www.sutton.gov.uk',
    phone: '020 8770 5000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [],
    leadership: {
      councilLeader: {
        name: 'Ruth Dombey',
        party: 'Liberal Democrat',
        role: 'Leader of Sutton Council',
        email: 'ruth.dombey@sutton.gov.uk',
      },
      chiefExecutive: {
        name: 'Nick Ireland',
        role: 'Chief Executive',
        email: 'chiefexecutive@sutton.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8770 5000',
        email: 'highways@sutton.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8770 5000',
        email: 'waste@sutton.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste'],
      },
      parks: {
        name: 'Parks and Countryside',
        head: 'Parks Manager',
        phone: '020 8770 5000',
        email: 'parks@sutton.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  'Tower Hamlets': {
    name: 'London Borough of Tower Hamlets',
    website: 'https://www.towerhamlets.gov.uk',
    phone: '020 7364 5000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.towerhamlets.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Lutfur Rahman',
        party: 'Aspire',
        role: 'Mayor of Tower Hamlets',
        email: 'mayor@towerhamlets.gov.uk',
      },
      chiefExecutive: {
        name: 'Stephen Halsey',
        role: 'Chief Executive',
        email: 'chiefexecutive@towerhamlets.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 7364 5000',
        email: 'highways@towerhamlets.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 7364 5000',
        email: 'waste@towerhamlets.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 7364 5000',
        email: 'parks@towerhamlets.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  'Waltham Forest': {
    name: 'London Borough of Waltham Forest',
    website: 'https://www.walthamforest.gov.uk',
    phone: '020 8496 3000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.walthamforest.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Grace Williams',
        party: 'Labour',
        role: 'Leader of Waltham Forest Council',
        email: 'grace.williams@walthamforest.gov.uk',
      },
      chiefExecutive: {
        name: 'Althea Loderick',
        role: 'Chief Executive',
        email: 'chiefexecutive@walthamforest.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8496 3000',
        email: 'highways@walthamforest.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8496 3000',
        email: 'waste@walthamforest.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8496 3000',
        email: 'parks@walthamforest.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
  Wandsworth: {
    name: 'London Borough of Wandsworth',
    website: 'https://www.wandsworth.gov.uk',
    phone: '020 8871 6000',
    region: 'London',
    type: 'London Borough',
    rssFeeds: [
      {
        url: 'https://www.wandsworth.gov.uk/news/rss',
        type: 'news',
      },
    ],
    leadership: {
      councilLeader: {
        name: 'Simon Hogg',
        party: 'Labour',
        role: 'Leader of Wandsworth Council',
        email: 'simon.hogg@wandsworth.gov.uk',
      },
      chiefExecutive: {
        name: 'Ravinder Jassar',
        role: 'Chief Executive',
        email: 'chiefexecutive@wandsworth.gov.uk',
      },
    },
    departments: {
      highways: {
        name: 'Highways and Transport',
        head: 'Highways Manager',
        phone: '020 8871 6000',
        email: 'highways@wandsworth.gov.uk',
        categories: ['potholes', 'road defects', 'street lights', 'parking', 'traffic lights'],
      },
      waste: {
        name: 'Waste and Recycling',
        head: 'Waste Manager',
        phone: '020 8871 6000',
        email: 'waste@wandsworth.gov.uk',
        categories: ['bins', 'recycling', 'fly-tipping', 'bulky waste', 'street cleaning'],
      },
      parks: {
        name: 'Parks and Open Spaces',
        head: 'Parks Manager',
        phone: '020 8871 6000',
        email: 'parks@wandsworth.gov.uk',
        categories: ['trees', 'graffiti', 'parks', 'playgrounds'],
      },
    },
  },
};
