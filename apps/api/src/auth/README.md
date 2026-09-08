# Authentication module boundaries

Sprint 1 functionality remains in the existing service and controller. Future Sprint modules are deliberately separated into `constants`, `interfaces`, `decorators`, `jwt`, `roles`, `refresh-token`, `password-reset`, and `email-verification` concerns so authentication changes do not grow into one service.
