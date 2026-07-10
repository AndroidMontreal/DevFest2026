export type HomeLandingCopy = {
  hero: {
    phase: string;
    title: string;
    subtitle: string;
  };
  stats: {
    workshops: {
      label: string;
      value: string;
    };
    attendees: {
      label: string;
      value: string;
    };
    speakers: {
      label: string;
      value: string;
    };
  };
  hud: {
    date: string;
    location: string;
    countdown: {
      days: {
        label: string;
      };
      hours: {
        label: string;
      };
      minutes: {
        label: string;
      };
      seconds: {
        label: string;
      };
    };
  };
  ticker: {
    item1: string;
    item2: string;
    item3: string;
    item4: string;
  };
  gallery: {
    header: {
      subheading: string;
      heading: {
        line1: string;
        line2: string;
      };
    };
    items: {
      imageSrc: string;
      label: string;
      width: number;
      height: number;
    }[];
  };
  sponsors: {
    header: {
      subheading: string;
      heading: {
        line1: string;
        line2: string;
      };
    };
    cta: {
      label: string;
      link: string;
    };
    tiers: {
      title: string;
      subtitle: string;
      badge: string;
      items: {
        name: string;
        logo?: string;
        link?: string;
      }[];
    }[];
  };
};
