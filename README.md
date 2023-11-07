# staticpub.mauve.moe
Extperiments with static ActivityPub publishing and Distributed Press

# How to use:

- Fork the repo
- Change the domain to your site
- change the username
- run `node make_keypair.js` to make a new `keypair.json`
- run `node create_account.js` to make the account on the inbox instance
- When you have a new post, modify `notify_followers.js` and run it to notify followers about it.

We strongly recommend running your own social inbox instance so you can have more reliability and control over blocklists/allowlists.
