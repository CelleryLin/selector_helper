import { FC } from 'react';
import { ConfigProvider } from 'antd';
import { useThemeConfig } from '@/hooks/useThemeConfig';
import SectionHeader from '#/SectionHeader.tsx';

const App: FC = () => {
  const [themeConfig, _setThemeConfig] = useThemeConfig();

  return (
    <ConfigProvider theme={themeConfig}>
      <SectionHeader />
    </ConfigProvider>
  );
};

export default App;
