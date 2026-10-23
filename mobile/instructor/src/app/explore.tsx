import React from 'react';
import { Redirect } from 'expo-router';

export default function InstructorExploreRedirect() {
  return <Redirect href="/dashboard/schedule" />;
}
