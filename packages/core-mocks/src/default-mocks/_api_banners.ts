import { defineMock } from '@n2m/core-mocks'

export default defineMock({
  status: 200,
  timeout: 100,
  data: (req) => {
    return {
      data: [
        {
          id: 1,
          lang: 'en',
          head: 'Welcome to Our Casino',
          subhead: 'Enjoy the best games and bonuses',
          has_button: 1,
          button_text_for_login: 'Play Now',
          button_link_for_login: '/games',
          button_text_for_public: 'Sign Up',
          button_link_for_public: '/register',
          image_path: '/images/mocks/banner-mock.jpg',
          timer_started_at: '2023-05-01T00:00:00.000Z',
          timer_finished_at: '2023-05-31T23:59:59.000Z',
          has_countdown: 1,
        },
        {
          id: 2,
          lang: 'es',
          head: 'Bienvenido a Nuestro Casino',
          subhead: 'Disfruta de los mejores juegos y bonos',
          has_button: 0,
          button_text_for_login: null,
          button_link_for_login: null,
          button_text_for_public: null,
          button_link_for_public: null,
          image_path: '/images/mocks/banner-mock.jpg',
          timer_started_at: '2023-06-01T00:00:00.000Z',
          timer_finished_at: '2023-06-30T23:59:59.000Z',
          has_countdown: 0,
        },
        {
          id: 3,
          lang: 'fr',
          head: 'Bienvenue dans Notre Casino',
          subhead: 'Profitez des meilleurs jeux et bonus',
          has_button: 1,
          button_text_for_login: 'Jouer Maintenant',
          button_link_for_login: '/fr/games',
          button_text_for_public: "S'inscrire",
          button_link_for_public: '/fr/register',
          image_path: '/images/mocks/banner-mock.jpg',
          timer_started_at: '2023-07-01T00:00:00.000Z',
          timer_finished_at: '2023-07-31T23:59:59.000Z',
          has_countdown: 1,
        },
      ],
    }
  },
})
