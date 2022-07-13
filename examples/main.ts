/* tslint:disable:no-console */
// @ts-nocheck
import 'dotenv/config';
import { IgApiClient } from '../src';
import * as config from './config';

function hasKeywords(text) {
  for (const keyword of config.keywords) {
    if (text.includes(keyword)) return true;
  }
  return false;
}

(async () => {
  if (process.env.IG_USERNAME === undefined && process.env.IG_PASSWORD === undefined) {
    process.exit(1);
  }
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  const targets = {};
  for (const target of config.users) {
    const user = await ig.user.searchExact(target);
    const followingFeed = ig.feed.accountFollowing(user.pk);
    //const resp = await followingFeed.request();
    while (true) {
      const users = await followingFeed.items();
      for (const user of users) {
        targets[user.username] = user;
      }
      if (!followingFeed.isMoreAvailable()) break;
    }
    //const user = await ig.user.webProfileInfo("haruka_.style");
  }
  for (const username of Object.keys(targets)) {
    const user = await ig.user.webProfileInfo(username);
    if (hasKeywords(user.biography)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(
        `"${user.username}", "${user.full_name.replaceAll('"', '""')}", "https://www.instagram.com/${
          user.username
        }/", "${user.edge_followed_by?.count}", "${user.biography.replaceAll('"', '""')}"`,
      );
    }
  }

  //console.log(user.biography.includes('大腸活'));
  //const user = await ig.user.webProfileInfo("haruka_.style");
  //  result = result + i;
  //} while (followingFeed.isMoreAvailable());
  //console.log(
  //  `"${user.username}", "${user.full_name}", "https://www.instagram.com/${user.username}/", "${user.edge_followed_by?.count}", "${user.biography}"`,
  //);

  /*
    const user = await ig.user.searchExact("o3_imy");
    const followingFeed = ig.feed.accountFollowing(user.pk);
    const wholeResponse = await followingFeed.request();
    console.log(wholeResponse.users[0]); // You can reach any properties in instagram response
    console.log(wholeResponse.users.length); // You can reach any properties in instagram response
    let items = await followingFeed.items();
    console.log(items.length);
    items = await followingFeed.items();
    console.log(items.length);
    console.log(followingFeed.isMoreAvailable());
    items = await followingFeed.items();
    console.log(items.length);
    console.log(followingFeed.isMoreAvailable());
    items = await followingFeed.items();
    console.log(items.length);
    console.log(followingFeed.isMoreAvailable());
    items = await followingFeed.items();
    console.log(items.length);
    console.log(followingFeed.isMoreAvailable());
    items = await followingFeed.items();
    console.log(items.length);
    console.log(followingFeed.isMoreAvailable());
    items = await followingFeed.items();
    console.log(items.length);
    console.log(followingFeed.isMoreAvailable());
    items = await followingFeed.items();
    console.log(items.length);
    console.log(followingFeed.isMoreAvailable());
    */

  //const followingFeed = ig.feed.accountFollowers(auth.pk);
  //const wholeResponse = await followingFeed.request();
  //console.log(wholeResponse); // You can reach any properties in instagram response
  //const items = await followingFeed.items();
  //console.log(items); // Here you can reach items. It's array.
  //const thirdPageItems = await followingFeed.items();
  // Feed is stateful and auto-paginated. Every subsequent request returns results from next page
  //console.log(thirdPageItems); // Here you can reach items. It's array.
  //const feedState = followingFeed.serialize(); // You can serialize feed state to have an ability to continue get next pages.
  //console.log(feedState);
  //followingFeed.deserialize(feedState);
  //const fourthPageItems = await followingFeed.items();
  // You can use RxJS stream to subscribe to all results in this feed.
  // All the RxJS powerful is beyond this example - you should learn it by yourself.
  //followingFeed.items$.subscribe(
  //	following => console.log(following),
  //	error => console.error(error),
  //	() => console.log('Complete!'),
  //);
})();
