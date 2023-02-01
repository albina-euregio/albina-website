export interface RegionOutlineProperties {
  id: string;
  aws: Aws[];
}

export interface Aws {
  name: string;
  url: AwsURL[];
}

export interface AwsURL {
  fr?: string;
  de?: string;
  en?: string;
  it?: string;
  oc?: string;
  ca?: string;
  es?: string;
  cs?: string;
  fi?: string;
  sv?: string;
  is?: string;
  no?: string;
  pl?: string;
  po?: string;
  se?: string;
  si?: string;
  sk?: string;
}
