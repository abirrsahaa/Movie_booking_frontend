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
    id:number;
    time: string;
   
    price: number;
  }
  
  export interface Cinema {
    id:number;
    name: string;
    distance: string;
    showtimes: Showtime[];
   
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
    id: number;
    seatNumber: number;
    seatAvailable: boolean;
    seatRow?: string;
    section?: string;
    price?: number;
    showtime?:intermediate_showtime;
  }

  interface intermediate_showtime{
    id:number;
    movie?:HomePageMovie
  }

  export interface HeroSectionProps {
    movie: HomePageMovie;
  }

    export interface SeatSelectionProps {
      movie: HomePageMovie;
      cinema: Cinema | null;
      showtime: Showtime | null;
      onClose: () => void;
      open: boolean;
    }
    
    export interface MovieDetailsPageProps {
     
      dates: { day: string; date: string; month: string }[];
      cinemas: Cinema[];
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
        movie: HomePageMovie;
        dates: { day: string; date: string; month: string }[];
        cinemas: Cinema[];
        staggerChildren: any;
        slideUp: any;
        onShowtimeSelect: (cinema: any, showtime: any) => void;
      }
  

      export interface SeatMapProps{
        movie: DetailsMovie;
        cinema: Cinema|null;
        showtime: Showtime|null;
        seatMap: Record<string, Record<string, Seat[]>>;
        selectedSeats: Seat[];
        toggleSeat: (seat: Seat, section: string, row: string) => void;
        prices: any;
        // onProceed: () => void;
        onClose: () => void;
        grandTotal: number;
        setStep: (step: 'seats' | 'payment' | 'confirmation') => void;
      }

     export  interface PaymentStepProps {
        setStep: (step: "seats" | "payment") => void;
      movie: DetailsMovie;
      cinema: Cinema|null;
      showtime: Showtime|null;
      selectedSeats: Seat[];
      
      convenienceFee: number;
      grandTotal: number;
      paymentMethod: "card" | "wallet";
      setPaymentMethod: (method: "card" | "wallet") => void;
      processPayment: () => void;
      isProcessing: boolean;
      error: string | null;
      
    }

    export interface ConfirmationStepProps {
        movie: any;
        cinema: any;
        showtime: any;
        selectedSeats: any[];
        grandTotal: number;
        onClose: () => void;
      }