import { Redirect } from 'expo-router';

export default function DiaryRedirect() {
  return <Redirect href={"/parent" as any} />;
}
