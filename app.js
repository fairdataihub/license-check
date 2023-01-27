/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const generateLicenseText = (license, licenseName) => {
  if (licenseName === "MIT") {
    return `MIT License`;
  }
  if (licenseName === "Apache-2.0") {
    return `Apache License`;
  }
  if (licenseName === "GPL-3.0") {
    return `GNU General Public License v3.0`;
  }
};

const checkRepoForLicense = async (context) => {
  const owner = context.payload.installation.account.login;
  const repo = context.payload.repositories[0].name;
  console.log("Making license request");
};

module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  /*app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });*/

  app.on("issue_comment.created", async (context) => {
    const comment = context.payload.comment.body;
    // Get the user that made the comment
    const user = context.payload.comment.user;
    console.log(user);
    console.log(comment);
    if (comment === "/license") {
      const owner = context.payload.repository.owner.login;
      const repo = context.payload.repository.name;
      const path = "LICENSE";
      const message = "Add License to Repository";
      const content = Buffer.from("This is a test").toString("base64");
      const branch = "main";
      const name = "fairdataihub-bot";
      const email = "fairdataihub@gmail.com";

      try {
        console.log("Adding License File");
        // IMP: THIS FAILS IF A LICENSE FILE IS ALREADY THERE NEEDS TO BE ADDRESSED
        const res = await context.octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message,
          content,
          branch,
          name,
          email,
          name,
          email,
        });
        console.log("Added License File");
        console.log(res);
      } catch (error) {
        console.log("error adding license file:");
        console.log(error);
      }
    }
  });

  // Create a on installation listener that checks the repository for a License and opens an issue if it does not have one
  app.on("installation.created", async (context) => {
    const owner = context.payload.installation.account.login;
    const repo = context.payload.repositories[0].name;
    console.log("Making license request");
    try {
      const license = await context.octokit.rest.licenses.getForRepo({
        owner,
        repo,
      });
      console.log(license);
    } catch (error) {
      console.log("Opening Issue since user repo does not have license");
      const repoIssue = await context.octokit.rest.issues.create({
        owner,
        repo,
        title: "No License",
        body: "Please add a license to your repository",
      });
      console.log(repoIssue);
    }
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
