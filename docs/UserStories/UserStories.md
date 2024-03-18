# User Stories

## Minimum Viable Product

### Registration

- As a unregistered user, I want to register my email, username and password, to become an administrator.
- As a unregistered user, I want to register my email, username and password, to become a customer.
- As a registered user, I want an appropriate error message if my registration fails.

### Login

- As a registered administrator, I want to log in using my email and password, to access the system.
- As a registered customer, I want to log in using my email and password, to access the system.
- As an unregistered user, I want an appropriate error message if my registration fails.
- As a user, I want secure error messages if login fails.

## Medium Viable Product

### Admin Actions

- Create, view, update and delete Dishes.

### Customer Actions

- View a list of all Dish es, to select specific Dishes I want.
- View details of a specific Dish, to decide what to Order.
- Create, update and delete an Order ( Order.status === "Pending").
- Rate Dishes in my Order History, to update the Dishes rating field.
- Update Dish ratings in my Order History.
- Only create and update Ratings in my order history.

## Maximum Viable Product

## Registration

- Federated Sign up as a Vendor or as a Customer by giving my name, email and password.
- Federated Sign up as a Customer by giving my name, email and password.
- Federated Sign up as a Super Admin by giving my name, email and password.

## Login

- Federated Login as a Customer.
- Federated Login as a Vendor.
- Federated Login as a Super Admin.

## Super Admin

- Reasonably complete control, to administer the system.
- View, update, and delete any Vendor.
- View, update, and delete any Dish.
- View, update, and delete any Order.

## Vendor Admin

- Create, update, view and delete Dishes.
- View my current Orders.
- Update my Order status, "Pending", "In Progress", "Delivered", and "Complete".
- I want my list of available dishes to update on every "Pending" order.

## Customer

- View list of Vendors.
- View details of a Vendor.
- View list of Vendor's Dishes.
- View the details of a Vendor Dish.
- Place an Order for a Dish.

## All

- Rate Limiting on users
