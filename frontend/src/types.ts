// Mirror the SQLAlchemy Project model + schema
export interface Element {
    type: string;
    label: string;
    x: number;
    y: number;
  }
  
  export interface ProjectConfig {
    elements: Element[];
    // add other config fields here as you extend your schema
  }
  
  export interface ProjectOut {
    id: number;
    name: string;
    config: ProjectConfig;
    owner_id: number;
  }