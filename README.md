
# lush-car-hailing
---
Exzing Technology has implemented a special kind of car hailing service that cares about the environment. We are integrating the solution with XRPL blockchain solution to enable each user that signs up to mint their carbon fingerprint as an NFT from a unique XRPL wallet. The ultimate aim includes using these NFT collections for data analytics that can help globally to fight climate change. They could also decide to monetize their data in the marketplace.
This project consists of both the lushdriver app and the lushrider app

---
## Technical Design
[LushRide Architecture.pdf](https://github.com/exzing/lush-car-hailing/files/11860477/LushRide.Architecture.pdf)

The app is architected with a typical design of a ride sharing mobile application except that this time additional features are added to make it unique. The unique feature include a **carbon footprint calculator** and an **NFT funtionality** powered by **XRPL** chain. Both the rider and driver apps use the Firebase Authentication SDK for managing users access to the app. During the signup process, information entered by the user is used to calculate the carbon footprint. The XRPL React SDK enables the implementation of an XRPL Wallet with the capability of Minting an NFT out of the unique value of the user's carbon footprint. This value is stored in the Wallet Page of the app.

For the purpose of redundancy and emergency, users data are hosted in different services including IPFS, AWS S3, and Google Storage (accessed via Firebase Realtime SDK). We haven't yet implemented the IPFS scheme but will be doing that in the next iteration.
We also have a partnership with Azure, that affords us free credits to user their services for some workloads. This is really important because the solution is a complex one that will need to scale with users' widespread adoption. 

An **analytics board** will be added in due course to the journey page of the users to keep them informed of their carbon footprint evaluations.

---
## Technology stacks
 * React-native
 * Google Cloud Patform (GCP)
 * Microsoft Azure
 * AWS
 * Google Maps
 * XRPL Chain
 * IPFS
---
## Problem we are solving
We noticed that a lot of users (riders and drivers) of ride-hailing apps have no idea how their activities impact the environment in terms of carbon footprint or emmission. This is a serious issue considering the deteriorating effect of climate change globally. Furthermore, most drivers are groaning under the burden of huge remittances to ride-sharing app owners

---
## Solution
Our solution is robust and unique in the sense that it will increase users awareness right from the signup page and all through the driving period. So they get to monitor their carbon footprint as they take various actions to reduce it to considerable levels. We are also proposing a more competitive price regime that will see us garner huge user base in no time.

To further make the solution more encompassing we've decided to add a blockchain layer (XRPL) to enable minting of NFTs in form of their unique carbon footprint values.

---
## Demo
You can find the demo here: https://www.exzing.com/product

---
## Guidelines On Running the App
Navigate to the driver app in the lushdriver directory and its rider counterpart in the lushrider directory. In these directories, you will find the instructions to run the app. If you're having any trouble doing this, we have also included an APK here for you to use and view the app.

---
