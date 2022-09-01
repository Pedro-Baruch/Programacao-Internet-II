## O que foi usado

	Express
	Mongodb
	Jsonwebtoken
	Brycpt
	Typescript

## Estrutura do projeto

	src
		controllers:
			authController.ts
		data:
			mongodb.ts
		middlewares: 
			authMiddleware.ts
		helpers: 
			passHelper.ts
			tokenHelper.ts
		repository: 
			 userRepository.ts
		routes: 
			 authRoutes.ts
			 index.ts
		server.ts: express config

## Feito

- Rota de registro salvando a senha do usuário encriptada utilizando o "bcrypt";
- Rota de login gerando um access token e um refresh token;
- Funçao authMiddleware usando jwt; 
- Rota refresh retornando um par de tokens novos;
- Rota alterar senha (sem politica de senha)
