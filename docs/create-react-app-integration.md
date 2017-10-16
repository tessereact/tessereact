# How to integrate Tessereact with create-react-app

Install `create-react-app` if you did not do that already:

```sh
npm install -g create-react-app
```

Scaffold an app with create-react-app:

```sh
create-react-app react-app
cd react-app
```

Install Tessereact packages:

```sh
yarn add -D tessereact tessereact-scripts

# or

npm install --save-dev tessereact tessereact-scripts
```

Add `tessereact` script to your package.json:

```js
{
  // ...
  "scripts": {
    // ...
    "tessereact": "tessereact-start"
  }
}
```

Run tessereact:

```sh
yarn tessereact

# or

npm run tessereact
```
