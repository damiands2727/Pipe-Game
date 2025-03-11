# The Goals of This Task

> This material was covered in the videos you have been pointed to and within the wiki

You will set up a skeleton of page/application where you will be building an application and developing your skills as a developer

### Extensions

Recommended Extensions are actually required.

### Commands to Get Started Examples

These are the command example that you would need to run out of the terminal to get your react application up and running.

#### Yarn

From within the folder that contains the `package.json` file.

```bash
yarn install
```

Then you execute:

```bash
yarn start
```

### Install Sabio Module

From Bash window run the following command

```bash
npm install sabio -g
```

or

```bash
yarn run sabio
```

##### Back Up Your Work

To safely back up your work to GitHub repository you can run the following command from within the terminal.

You can do this any time.

The first time you do this, you will be prompted for some information.

> If this fails the first time you do this, be sure to bring this up to an instructor the NEXT time you get on the Q. ( Not now, but the _NEXT_ time you get on the Q)

```bash
yarn run share
```

This "share" command is actually running our "sabio" module with the "share branch" command. This is that command:

```bash
sabio -sb
```

This command will save a copy of your code on our GitHub account so you can share or backup you code. You can/should do this every day.

### Already Installed Into This Application

The following modules are already installed

#### bootstrap

- https://getbootstrap.com/

This module provide the HTML/CSS and JS Framework that drive the foundational aspects of the UI.

##### reactstrap

This is a React wrapper for Boostrap. It is optional to use this and we recommend you use bootstrap directly when possible.

##### axios

This library is used to make Ajax requests to a server.

##### react-router

The module we use to make client side routing possible

##### toastr

- https://github.com/CodeSeven/toastr

This is to be used to provide informational messages to the user. For example in the following situations:

- "You have logged in successfully"
- "You have created a record"
- "You have uploaded a file"

##### sweetalert

- https://sweetalert.js.org/guides/#using-with-libraries

Alerts are very obtrusive so they should not be used every time you want to provide feedback to a user. Instead use them when you want to confirm the user wants to perform an action or when you want to give a user a choice of actions.

A great example is when a user clicks a "Delete" button. Instead of just moving forward with a delete operation, "Alert" them to confirm that they DO, in fact, want to _DELETE_ the record.

##### rc-pagination

- https://github.com/react-component/pagination

This tool provide for you a ready to use component to draw a pagination tool to use to navigation from page to page, go "next" and "previous". **_Read more_ below.**

##### Using rc-pagintation

Once you are ready to do pagination in React you should use the library installed already called rc-pagination.

For more on using this go to he documentation:

- https://github.com/react-component/pagination

_It is very important that you import the css file to use this library_

To import the css file add to the top of the component:

```javascript
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
```

Here is stubbed out snippet where you still have to proivde much of the logic. Be sure to look at the documention so that you can determine what other properties you need to use.

````javascript
export default class App extends React.Component {
  state = {
    current: 3,
  };

  onChange = page => {
    console.log(page);
    this.setState({
      current: page,
    });
  };

  render() {
    return (
      <Pagination
        onChange={this.onChange}
        current={this.state.current}
        total={25}
        locale={locale}
      />
    );
  }
}```
````
