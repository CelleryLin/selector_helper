type FilterOption =
  | '名稱'
  | '教師'
  | '學程'
  | '年級'
  | '班別'
  | '系所'
  | '必修'
  | '學分'
  | '英課';

export type AdvancedFilterOption = FilterOption | '星期' | '節次';

export type AdvancedFilterElement = {
  active: boolean;
  value: string;
  filterLogic: 'equal' | 'include' | 'exclude';
  activeOptions: Record<string, boolean>;
};

export type AdvancedFilterType = {
  [key in AdvancedFilterOption]: AdvancedFilterElement;
};
