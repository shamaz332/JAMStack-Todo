Now we will add a dependency package in the netlify function

cd functions/graphql_hello

npm init

npm install --save apollo-server-lambda graphql

add graphql_hello.js hello world code

netlify dev

Note that there are three servers running on local host, Functions server is listening on port 52810, Gatsby server running on port 8000, and proxy server running at port 8888

Now lets start building the client:

npm install @apollo/client --save


(((https://github.com/apollographql/apollo-server/issues/1989)))


Deploying with Netlify Functions>>>

https://www.apollographql.com/docs/apollo-server/deployment/netlify/

>>>>

Deploy a fullstack Apollo app with Netlify>>>

https://www.apollographql.com/blog/deploy-a-fullstack-apollo-app-with-netlify-45a7dfd51b0b/

>>>