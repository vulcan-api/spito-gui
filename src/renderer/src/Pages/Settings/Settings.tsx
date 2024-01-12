import MainSettings from "./Sections/MainSettings";
import SettingsSidebar from "./SettingsSidebar";

export default function Settings(): JSX.Element {
  return (
    <div className="flex flex-row gap-4 w-full">
      <SettingsSidebar />
      <MainSettings />
    </div>
  );
}
