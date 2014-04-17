jwt-auth-example
================

Authentication and authorization through JSON Web Token in middleware-supporting frameworks.

This example uses [`koa`](https://github.com/koajs/koa) and [`koa-router`](https://github.com/alexmingoia/koa-router)
the provide a simple base, but the concepts should work with every other system using middleware.

To keep it simple, there is no permanent storage implemented. We instead use the seed data in `/data`.

## Story

This example provides the API to a very simple travel blog where users can share their travel stories with the world.

## Requirements

* Stories are public and available to read for everyone.
* Authorized users can create stories. They can also edit and delete their story.
* Stories can have additional editors who are allowed to edit the story, but not delete it.
* Administrators can delete stories, but are not allowed to edit them.

**Later:**
It should also work with nested resources, for example comments embedded into stories.

## Auth

For the sake of simplicity there is only one resource: stories. The routes and their access role look as follows:

* `GET /stories` - List all stories. [public]
* `POST /stories` - Create a new story. [user (including admins)]
* `DELETE /stories` - Delete all stories. [admin]
*
* `GET /stories/:id` - Show the story. [public]
* `PATCH /stories/:id` - Update the story. [owner, editor]
* `DELETE /stories/:id` - Delete the story. [admin, owner]
*
* `GET /stories/own` - ?

## TODO

* Introduce [`bcrypt`](https://github.com/ncb000gt/node.bcrypt.js) to hash passwords. After all, it should be a guide
for best-practices, right?

## Notes

To check owner or editor access (auth by type, not by role), it is necessary to get the resource first.
But it doesn't seem right to load the resource via middleware, only to then check authorization via another middleware.

But it doesn't seem right either to check authorization inside the controller. Especially when authentication stays as
middleware.

Loading the resource first via middleware (to check auth) and then inside the controller again gives an additional round
trip.

Loading the resource via middleware doesn't work when additional/specific logic (for example via MongoDB aggregation
framework) needs to be applied.

## Problem

Authentication and role-based authorization are easy to solve, because the role is attached to the user object and the
required role is declared on the route.

But how can I control (authorization) access to a resource when the access details (id of the owning user, other users
with access granted) is encapsulated in the resource itself?
For example how can access be restricted to the owner/creator of the resource, or to an array of editors with access to
edit the resource.

### Ideas

#### Middleware

A pure middleware solution - that means requiring the resource, checking its access and maybe even returning it
directly, thus circumventing the controller completely  - is often shown in examples but isn't possible, because
sometimes there is complex response modifications or additional aggregation on the resource necessary. Which should
better be handled individually in the controller.

This leaves us with the only option and that is requiring what is immediately needed in the middleware and accept the
fact of an additional round-trip to the database.
We can still attach the fetched resource to the request in hope the following controller could use it.

#### Controller

Another option is to do the authorization checks only when all needed information is available and embed access control
inside the business logic. But this would go against SOLID design principles and put all the burden on the controller.
In addition, I feel like the business logic should be separated from the auth logic, especiall when authentication and
role-based authorization is still handled as middleware.

## Test

    nodemon --harmony --exec "mocha" --recursive