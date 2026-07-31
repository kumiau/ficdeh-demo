// Espejo de los esquemas descritos en data/README.md. Los datos se generan
// con scripts/build_data.py — no hay por qué editar estos campos por
// separado, cualquier campo nuevo sale de ahí.

export interface Film {
  title: string
  director: string | null
  durationMin: number | null
  country: string | null
  year: number | null
  category: string | null
  sala?: string | null
  qa?: string | null
  premiere?: string | null
  synopsisEs?: string | null
  synopsisEn?: string | null
  directorProfile?: string | null
  filmSocial?: string | null
  directorSocial?: string | null
  posterUrl?: string | null
  trailerUrl?: string | null
  themePrimary?: string | null
  themeSecondary?: string | null
  pressKitUrl?: string | null
  ageRating?: string | null
}

export interface Session {
  date: string
  time: string | null
  timeSortKey: number
  venueName: string | null
  venueAddress: string | null
  films: Film[]
  notes: string[]
}

export interface CityData {
  citySlug: string
  cityName: string
  sourceFiles: string[]
  sessions: Session[]
}

export interface CityIndexEntry {
  slug: string
  name: string
  sessionCount: number
  filmCount: number
}

export interface FestivalIndex {
  festivalYear: number
  cities: CityIndexEntry[]
  filmIndexCount: number
  warnings: string[]
}

export interface FilmScreening {
  citySlug: string
  cityName: string
  date: string
  time: string | null
  timeSortKey: number
  venueName: string | null
  venueAddress: string | null
}

export interface FilmIndexEntry extends Film {
  filmKey: string
  screenings: FilmScreening[]
}

export interface FilmsIndex {
  films: FilmIndexEntry[]
}
