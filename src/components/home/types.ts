export type HomeLandingCopy = {
  header: {
    logoAlt: string;
    city: string;
    registerLabel: string;
    registerAria: string;
  };
  nav: {
    home: string;
    team: string;
    schedule: string;
    speakers: string;
  };
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
};
