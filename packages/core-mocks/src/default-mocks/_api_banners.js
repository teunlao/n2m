import { defineMock } from '@combotech/core-mocks'

export default defineMock({
  status: 200,
  timeout: 50,
  data: (req) => {
    return {
      data: [
        {
          id: 1,
          lang: 'en',
          head: '<div class="text-primary-main">ДО +325% и +325 ФС<br/><span class="text-ne-white">К ДЕПОЗИТАМ</span></div>',
          subhead: 'Безлимитные выводы',
          has_button: 1,
          button_text_for_login: 'Play Now',
          button_link_for_login: '/games',
          button_text_for_public: 'Deposit',
          button_link_for_public: '/register',
          image_path: '/images/mocks/banner-mock-1.png',
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
          image_path: '/images/mocks/banner-mock-2.png',
          timer_started_at: '2023-06-01T00:00:00.000Z',
          timer_finished_at: '2023-06-30T23:59:59.000Z',
          has_countdown: 0,
        },
        {
          "id": 88,
          "lang": "Ru",
          "head": "\u0411\u043e\u0436\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0435 \u0424\u0421<br>\r\n\u0414\u043e 300 \u0424\u0421 \u043d\u0430 \u0434\u0435\u043f",
          "subhead": "<div>123</div>",
          "has_button": 1,
          "button_text_for_login": "\u0417\u0430\u0431\u0440\u0430\u0442\u044c",
          "button_link_for_login": "\/personal\/wallet\/deposit",
          "button_text_for_public": "\u0417\u0430\u0431\u0440\u0430\u0442\u044c",
          "button_link_for_public": "\/auth\/login",
          image_path: '/images/mocks/banner-mock-1.png',
          timer_started_at: '2023-07-01T00:00:00.000Z',
          timer_finished_at: '2023-07-31T23:59:59.000Z',
          has_countdown: 1,
        },
      ],
    }
  },
})
