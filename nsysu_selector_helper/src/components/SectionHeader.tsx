import { FC } from 'react';
import { Flex, Menu, MenuProps, theme } from 'antd';
import {
  BookFilled,
  BookOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import banner from '@/assets/banner.svg';
import styled from 'styled-components';

type HeaderProps = {};

const HeaderContainer = styled(Flex)<{
  $primaryColor: string;
  $textColor: string;
}>`
  padding: 0 20px;

  background-color: ${(props) => props.$primaryColor};
  color: ${(props) => props.$textColor};
`;

const StyledMenu = styled(Menu)<{
  $textColor: string;
}>`
  padding-bottom: 5px;
  background: transparent;

  li.ant-menu-item {
    background-color: transparent;
    color: ${(props) => props.$textColor} !important;
  }

  li.ant-menu-item-selected::after {
    border-bottom-color: ${(props) => props.$textColor} !important;
  }

  li.ant-menu-item-active::after {
    border-bottom-color: ${(props) => props.$textColor} !important;
  }
`;

const Brand = styled.img`
  height: 36px;
  margin-right: 20px;

  @media (max-width: 290px) {
    display: none;
  }
`;

const SectionHeader: FC<HeaderProps> = () => {
  const { token } = theme.useToken();
  const primaryColor = token.colorPrimary;
  const textColor = '#ffffff';

  const navTabs: MenuProps['items'] = [
    { key: 'all-courses', label: '所有課程', icon: <BookOutlined /> },
    { key: 'semester-compulsory', label: '學期必修', icon: <BookFilled /> },
    {
      key: 'course-detective',
      label: '課程偵探',
      icon: <FileSearchOutlined />,
    },
    { key: 'selected-export', label: '已選匯出', icon: <FileDoneOutlined /> },
    { key: 'announcements', label: '公告', icon: <NotificationOutlined /> },
  ];

  return (
    <HeaderContainer
      $primaryColor={primaryColor}
      $textColor={textColor}
      justify={'space-between'}
    >
      <Flex align={'center'} justify={'center'} style={{ padding: '5px' }}>
        <Brand src={banner as string} alt='NSYSU Selector Helper' />
      </Flex>
      <StyledMenu
        $textColor={textColor}
        mode='horizontal'
        items={navTabs}
        style={{
          marginLeft: 'auto',
        }}
        selectedKeys={['all-courses']}
      />
    </HeaderContainer>
  );
};

export default SectionHeader;
