import React, { Component } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import styled from 'styled-components';

import type {
  AdvancedFilterType,
  AdvancedFilterElement,
  AdvancedFilterOption,
} from '@/types';
import { DEFAULT_FILTER_OPTIONS, WEBSITE_COLOR } from '@/config';

const StyledDropdownMenu = styled(Dropdown.Menu)`
  max-height: 350px;
  overflow-y: auto;

  .dropdown-item {
    border: white 1px solid;

    &.active {
      color: white;
      background-color: ${WEBSITE_COLOR.mainColor};
    }

    &:active {
      color: white;
      background-color: ${WEBSITE_COLOR.mainColor};
    }
  }
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  background-color: ${WEBSITE_COLOR.mainColor};

  &:hover {
    background-color: ${WEBSITE_COLOR.mainDarkerColor};
  }

  &:active {
    background-color: ${WEBSITE_COLOR.mainColor};
  }
`;

const StyledFilterRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterLabel = styled.div`
  flex: 0 0 auto;
  width: 15%;
  padding-right: 15px;
`;

const FilterSelect = styled.div`
  flex: 0 0 auto;
  width: 30%;
  padding-right: 15px;
`;

const FilterInput = styled.div`
  flex: 1;
`;

const FilterSwitch = styled(Form.Check)`
  .form-check-input:checked {
    background-color: ${WEBSITE_COLOR.mainColor};
    border-color: ${WEBSITE_COLOR.mainColor};
  }

  .form-check-input:focus {
    border-color: ${WEBSITE_COLOR.mainColor};
    box-shadow: 0 0 0 0.2rem ${WEBSITE_COLOR.boxShadowColor};
  }
`;

interface FilterRowProps {
  filterName: AdvancedFilterOption;
  isDropdown: boolean;
  advancedFilters: AdvancedFilterType;
  filterOptions: typeof DEFAULT_FILTER_OPTIONS;
  onAdvancedFilterChange: (filter: AdvancedFilterType) => void;
  filterNameToDisplayName: (
    AdvancedFilterOption: AdvancedFilterOption,
    optionName: string,
  ) => string;
}

interface FilterRowState {
  searchValue: string;
}

class FilterRow extends Component<FilterRowProps, FilterRowState> {
  state = {
    searchValue: '',
  };

  /**
   * 計算篩選器選項
   * @param e {ChangeEventHandler<HTMLInputElement>} 輸入事件
   */
  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: e.target.value.toLowerCase() });
  };

  /**
   * 生成篩選器選項
   * @returns {string[]} 篩選器選項
   */
  generateFilteredOptions = (): string[] => {
    const { searchValue } = this.state;
    const { filterName, filterOptions } = this.props;

    // 檢查是否有設定顯示名稱
    const hasDisplayName =
      filterOptions[filterName].optionDisplayName &&
      filterOptions[filterName].optionDisplayName.length > 0;

    // 根據是否有顯示名稱來過濾選項
    return filterOptions[filterName].options.filter((option, index) => {
      // 如果有顯示名稱，則先將顯示名稱轉換為小寫並與輸入值比較
      if (hasDisplayName) {
        const displayName =
          filterOptions?.[filterName]?.optionDisplayName?.[index].toLowerCase();

        if (displayName) {
          return displayName.startsWith(searchValue.toLowerCase());
        }
      }
      // 如果沒有顯示名稱，則直接比較選項值
      return option.toLowerCase().startsWith(searchValue.toLowerCase());
    });
  };

  /**
   * 處理篩選器模式變化
   * @param filterName {AdvancedFilterOption} 篩選器名稱
   * @param mode {string} 篩選器模式
   */
  handleFilterModeChange = (filterName: AdvancedFilterOption, mode: string) => {
    const updatedAdvancedFilters = {
      ...this.props.advancedFilters,
      [filterName]: {
        ...this.props.advancedFilters[filterName],
        filterLogic: mode,
      },
    };

    this.props.onAdvancedFilterChange(updatedAdvancedFilters);
  };

  /**
   * 全選
   * @param filterName {AdvancedFilterOption} 篩選器名稱
   */
  handleSelectAll = (filterName: AdvancedFilterOption) => {
    // 創建一個新的選中狀態對象，將所有選項設為選中
    const advancedFilterElement: AdvancedFilterElement = {
      value: '',
      active: this.props.advancedFilters[filterName].active,
      filterLogic: this.props.advancedFilters[filterName].filterLogic,
      activeOptions: {},
    };
    this.props.filterOptions[filterName].options.forEach((option) => {
      advancedFilterElement.activeOptions[option] = true;
    });

    // 創建 advancedFilters 的副本並更新
    const updatedAdvancedFilters = {
      ...this.props.advancedFilters,
      [filterName]: advancedFilterElement,
    };

    // 更新父組件的狀態
    this.props.onAdvancedFilterChange(updatedAdvancedFilters);
  };

  /**
   * 取消全選
   * @param filterName {AdvancedFilterOption} 篩選器名稱
   */
  handleDeselectAll = (filterName: AdvancedFilterOption) => {
    // 創建 advancedFilters 的副本並將對應篩選器的選中狀態清空
    const updatedAdvancedFilters = {
      ...this.props.advancedFilters,
      [filterName]: {
        value: '',
        active: this.props.advancedFilters[filterName]?.active ?? false,
        filterLogic:
          this.props.advancedFilters[filterName]?.filterLogic ?? 'include',
        activeOptions: {},
      },
    };

    // 更新父組件的狀態
    this.props.onAdvancedFilterChange(updatedAdvancedFilters);
  };

  /**
   * 選擇/取消選擇選項
   * @param filterName {AdvancedFilterOption} 篩選器名稱
   * @param option {string} 選項名稱
   */
  handleOptionSelect = (filterName: AdvancedFilterOption, option: string) => {
    // 創建當前篩選選項的副本
    const selected = { ...(this.props.advancedFilters[filterName] || {}) };

    // 更新選項的選中狀態
    if (selected.activeOptions[option]) {
      delete selected.activeOptions[option];
    } else {
      selected.activeOptions[option] = true;
    }

    // 創建整個 advancedFilters 的副本並更新相應的篩選器
    const updatedAdvancedFilters = {
      ...this.props.advancedFilters,
      [filterName]: selected,
    };

    // 通過父組件的方法更新篩選器
    this.props.onAdvancedFilterChange(updatedAdvancedFilters);
  };

  /**
   * 處理文字篩選器變化
   * @param filterName {AdvancedFilterOption} 篩選器名稱
   * @param value {string} 篩選器值
   */
  handleTextFilterChange = (
    filterName: AdvancedFilterOption,
    value: string,
  ) => {
    // 創建 advancedFilters 的副本並更新相應的過濾器值
    const updatedAdvancedFilters = {
      ...this.props.advancedFilters,
      [filterName]: {
        ...this.props.advancedFilters[filterName],
        value: value,
      },
    };

    // 更新父組件的狀態
    this.props.onAdvancedFilterChange(updatedAdvancedFilters);
  };

  /**
   * 處理篩選器啟用狀態變化
   * @param filterName {AdvancedFilterOption} 篩選器名稱
   */
  handleFilterActivationChange = (filterName: AdvancedFilterOption) => {
    // 創建 advancedFilters 的副本並更新相應的過濾器值，預設是關閉的
    const updatedAdvancedFilters = {
      ...this.props.advancedFilters,
      [filterName]: {
        ...this.props.advancedFilters[filterName],
        active: !(this.props.advancedFilters[filterName]?.active ?? false),
      },
    };

    // 更新父組件的狀態
    this.props.onAdvancedFilterChange(updatedAdvancedFilters);
  };

  render() {
    const { searchValue } = this.state;
    const { filterName, isDropdown, advancedFilters, filterNameToDisplayName } =
      this.props;

    const filteredOptions = this.generateFilteredOptions();

    const selected: AdvancedFilterElement = advancedFilters[filterName] || {
      value: '',
      active: false,
      filterLogic: 'include',
      activeOptions: {},
    };
    if (!selected.value) {
      selected.value = '';
    }
    if (!selected.filterLogic) {
      selected.filterLogic = 'include';
    }
    if (!selected.activeOptions) {
      selected.activeOptions = {};
    }
    const textInput = advancedFilters[filterName]?.value || '';
    const filterLogic = advancedFilters[filterName]?.filterLogic ?? 'include';

    return (
      <StyledFilterRow>
        <FilterLabel>{filterName}</FilterLabel>
        <FilterSelect>
          <Form.Select
            id={`advanced-filter-include-${filterName}`}
            onChange={(e) =>
              this.handleFilterModeChange(filterName, e.target.value)
            }
            value={filterLogic}
          >
            <option value='equal'>等於</option>
            <option value='include'>包含</option>
            <option value='exclude'>不包含</option>
          </Form.Select>
        </FilterSelect>
        <FilterInput>
          {isDropdown ? (
            <Dropdown autoClose='outside'>
              <StyledDropdownToggle variant='success'>
                {!selected.active ? '未啟用' : '選擇了'}{' '}
                {Object.keys(selected.activeOptions).length} 項
              </StyledDropdownToggle>
              <StyledDropdownMenu>
                <Dropdown.Item
                  as='button'
                  onClick={() => this.handleSelectAll(filterName)}
                >
                  全選
                </Dropdown.Item>
                <Dropdown.Item
                  as='button'
                  onClick={() => this.handleDeselectAll(filterName)}
                >
                  取消全選
                </Dropdown.Item>
                <Form.Control
                  autoFocus
                  id={`dropdown-search-${filterName}`}
                  className='mx-3 ps-0 w-auto shadow-none border-0 border-bottom rounded-0'
                  placeholder={`搜尋${filterName}...`}
                  onChange={this.handleSearchChange}
                  value={searchValue}
                />
                <Dropdown.Divider />
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <Dropdown.Item
                      key={index}
                      active={selected.activeOptions[option]}
                      onClick={() =>
                        this.handleOptionSelect(filterName, option)
                      }
                    >
                      {filterNameToDisplayName(filterName, option) ?? option}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>沒有符合的項目</Dropdown.Item>
                )}
              </StyledDropdownMenu>
            </Dropdown>
          ) : (
            <Form.Control
              id={`advanced-filter-text-${filterName}`}
              type='text'
              placeholder={`搜尋${filterName}...`}
              value={textInput || ''}
              onChange={(e) =>
                this.handleTextFilterChange(filterName, e.target.value)
              }
            />
          )}
        </FilterInput>
        {isDropdown && (
          <FilterSwitch
            id={`advanced-filter-enable-${filterName}`}
            type='switch'
            onChange={() => this.handleFilterActivationChange(filterName)}
            checked={advancedFilters[filterName]?.active ?? false}
          />
        )}
      </StyledFilterRow>
    );
  }
}

export default FilterRow;
