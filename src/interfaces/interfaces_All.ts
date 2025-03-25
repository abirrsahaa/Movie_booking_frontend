export interface HomePageMovie {
    id: number;
    title: string;
    image: string;
    type: string;
    isNew?: boolean;
  }

export   interface QuickLinkProps {
      fadeInVariants: any;
      containerVariants: any;
      itemVariants: any;
      
  }
  
 export  interface PromoOffer {
      id: number;
      title: string;
      description: string;
      code?: string;
    }
export interface OffersAndPromotionsProps {
 
    containerVariants: any;
    itemVariants: any;
   
}

export interface BrowseByCategoryProps {
    containerVariants: any;
    itemVariants: any;
}

export interface ComingSoonProps {
    
    containerVariants: any;
    itemVariants: any;
}

export interface NowShowingProps {
  
    containerVariants: any;
    itemVariants: any;
  }

  export interface DetailsMovie {
    title: string;
    rating: string;
    score: string;
    description: string;
    genres: string[];
    duration: string;
    ageRating: string;
    language: string;
    director: string;
    cast: string[];
    poster: string;
    banner: string;
  }
  
  export interface Showtime {
    time: string;
    type: string;
    price: number;
  }
  
  export interface Cinema {
    name: string;
    location: string;
    distance: string;
    showtimes: Showtime[];
    available: boolean;
  }
  
  export interface Review {
    name: string;
    publication: string;
    rating: number;
    text: string;
  }
  
  export interface Offer {
    title: string;
    code: string;
    description: string;
    expiry: string;
  }
  
  export interface Seat {
    id: string;
    number: number;
    status: 'available' | 'sold';
    row?: string;
    section?: string;
    price?: number;
  }

  export interface HeroSectionProps {
    movie: DetailsMovie;
  }

    export interface SeatSelectionProps {
      movie: DetailsMovie;
      cinema: Cinema | null;
      showtime: Showtime | null;
      onClose: () => void;
      open: boolean;
    }
    
    export interface MovieDetailsPageProps {
      movie: DetailsMovie;
      dates: { day: string; date: string; month: string }[];
      cinemas: Cinema[];
      reviews: Review[];
      offers: Offer[];
    }

    export interface OffersTabProps {
        offers:Offer[];
    }

    export interface ReviewsTabProps {
        reviews:Review[];
    }

    export interface CastTabProps {
        movie:DetailsMovie;
    }

    export interface AboutTabProps {
        movie:DetailsMovie;
    }

    export interface ShowtimesTabProps{
        dates: { day: string; date: string; month: string }[];
        cinemas: Cinema[];
        staggerChildren: any;
        slideUp: any;
        onShowtimeSelect: (cinema: Cinema, showtime: Showtime) => void;
        
    }

    export interface TabsSectionProps {
        movie: DetailsMovie;
        dates: { day: string; date: string; month: string }[];
        cinemas: Cinema[];
        reviews: Review[];
        offers: Offer[];
        staggerChildren: any;
        slideUp: any;
        onShowtimeSelect: (cinema: any, showtime: any) => void;
      }
  