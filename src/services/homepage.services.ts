interface HomePageProps {
  message: string;
}

function getHomePage(): Promise<HomePageProps> {
    return Promise.resolve({ message: 'okie' });
}

export default {
  getHomePage,
};
