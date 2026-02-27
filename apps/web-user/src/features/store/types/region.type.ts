export interface RegionDepth2Item {
  label: string;
  searchKeywords: string[];
  storeCount: number;
}

export interface RegionDepth1Item {
  label: string;
  searchKeywords: string[];
  storeCount: number;
}

export interface RegionData {
  depth1: RegionDepth1Item;
  depth2: RegionDepth2Item[];
}

export interface StoreRegionsResponse {
  regions: RegionData[];
}
