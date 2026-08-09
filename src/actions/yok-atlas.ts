'use server'

import { searchYokAtlasPrograms, type SearchYokAtlasParams, type YokAtlasProgramRow } from '@/lib/yok-atlas/search-programs'

export async function searchPrograms(params: SearchYokAtlasParams): Promise<YokAtlasProgramRow[]> {
  return searchYokAtlasPrograms(params)
}
