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
  