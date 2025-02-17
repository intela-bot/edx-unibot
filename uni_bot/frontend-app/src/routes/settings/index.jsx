import { useAppData } from '@context/app';
import {
  LanguagesSection,
  DimensionsSection,
  InfoSection,
  ColorsSection,
  GreetingSection,
} from './sections';


function Settings() {
  const { appData: { courseId } } = useAppData();

  return (
    <>
      <InfoSection courseId={courseId} />
      <LanguagesSection courseId={courseId} />
      <GreetingSection courseId={courseId} />
      <DimensionsSection courseId={courseId} />
      <ColorsSection courseId={courseId} />
    </>
  );
}

export default Settings;
