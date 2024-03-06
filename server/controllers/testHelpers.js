async function reqHandler(
  endpoint,
  req,
  extra = {
    lang: 'sv',
    userId: 'userid',
  }
) {
  const res = {
    render: jest.fn().mockName('render'),
    locals: { locale: { language: extra.lang } },
  }

  req.session = req.session ?? {
    passport: {
      user: {
        ugKthid: extra.userId,
      },
    },
  }

  const next = jest.fn(() => 'returnedNext').mockName('next')

  const returnValue = await endpoint(req, res, next)
  return { returnValue, res, req, next }
}

export { reqHandler }
