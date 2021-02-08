# Curvestone home assignment

This is a Curvestone home assignment.

It's a fullstack app consisting of reactjs frontend (bootstrapped from create-react-app) and basic express.js backend.

It's an application where user can input his initial portfolio value, date and portfolio allocations for different stocks.

After submitting, a query is being made to backend where external api (marketstack) is requested for values for those stocks.
Returned data is being manipulated on server side, returning user only the values he needs - aggregated values for 7-days periods
and stock names. Also, potential current portolio value is calculated based on the above assumptions.

Back on client side, current portfolio value is being calculated and displayed to user.

Apart from that, a line graph is being generated for each of the stock allocations (one per asset).

## Assumptions and limitations
- a quite big list of stock symbols is being fetched from external resource at the initial load of the page. It is being provided to a dataset form element so user can choose one from the dropdown list.
- marketstack only allows 1000 records to be returned so the maximum allowed is being set to 1000. If you ask for e.g 4 stocks
you will get 250 records per each stock. This limits time period to a large degree
- one of the requirements was to use a specific library to create graphs - highcharts. It is used in the projects and type of graph
chosen to display the data is simple line graph
- simple form validation is provided, with error messages displayed below the form, as well as spinner that displays while fetching the data from backend
- sass was added to project, some basic saas variables are used and app is optimized for mobile
- not being stock investor and knowing little about how to calculate portfolio value, I've made some assumptions when calculating current value. I'm taking the oldest and newest value for a given stock, calculate ratio, multiply by the percentage a given stock took in my portolio (weighted average), do the same to other stocks and apply final ratio value to initial portfolio balance.

## To run the project locally

`yarn` installs all required packages as incluced in package.json

`yarn start` runs front-end

`yarn server` runs node.js backend

## Available Scripts

In the project directory, you can run:

### `yarn server`

Runs the node.js server in the development mode and attaches it to http://localhost:3002.

It uses express.js, and will reload if you make edits due to nodemon package.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
