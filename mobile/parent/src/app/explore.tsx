import React from 'react';
import { Redirect } from 'expo-router';

export default function ParentExploreRedirect() {
  return <Redirect href="/dashboard/progress" />;
}
