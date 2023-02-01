/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const checkForExistingIssue = async (owner, repo, context, remove) => {
  try {
    // Fetch all open issues on Github Repo
    console.log("Fetching Github Issues");
    const issueList = await context.octokit.rest.issues.listForRepo({
      owner,
      repo,
    });
    // console.log(issueList);

    for (const issue of issueList.data) {
      // If github title matches Bot title, return true
      // Close issue if remove === true
      console.log("checking issues");
      console.log(issue);
      if (issue.title === "No License") {
        const issue_number = issue.number;
        console.log(issue_number);
        console.log("Remove? " + remove);
        if (remove) {
          console.log("closing github issue");
          try {
            let closeIssue = await context.octokit.rest.issues.update({
              owner,
              repo,
              issue_number,
              state: "closed",
            });
            console.log("Issue should be closed");
          } catch (error) {
            console.log("There was a problem closing the Github issue");
            console.log(error);
          }
        }
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log("Error fetch Github Issues");
  }
};

const createGithubIssue = async (owner, repo, context) => {
  let existingIssue = await checkForExistingIssue(owner, repo, context);
  if (!existingIssue) {
    //If false, no existing issue on missing License.
    try {
      console.log("Opening Issue since user repo does not have license");
      const repoIssue = await context.octokit.rest.issues.create({
        owner,
        repo,
        title: "No License",
        body: "Please add a license to your repository",
      });
    } catch (error) {
      console.log("There was an issue creating a Github Issue");
    }
  }
};

const checkRepoForLicense = async (owner, repo, context) => {
  try {
    console.log("Making license request");
    const license = await context.octokit.rest.licenses.getForRepo({
      owner,
      repo,
    });
    console.log("License was found");
    return true;
  } catch (error) {
    // No license was found
    console.log("No license found");
    return false;
  }
};

module.exports = (app) => {
  // Your code here
  // app.load(require('./middleware'))
  app.log.info("Yay, the app was loaded!");

  // Create a on installation listener that checks the repository for a License and opens an issue if it does not have one
  app.on("installation.created", async (context) => {
    const owner = context.payload.installation.account.login;
    const repo = context.payload.repositories[0].name;

    let status = await checkRepoForLicense(owner, repo, context);
    if (!status) {
      // create github issue if none exist
      console.log("No license found");
      await createGithubIssue(owner, repo, context);
    } else {
      console.log("License was found!");
    }
  });

  app.on("push", async (context) => {
    const owner = context.payload.repository.owner.name;
    const repo = context.payload.repository.name;

    let status = await checkRepoForLicense(owner, repo, context);
    console.log("License added? " + status);
    if (status) {
      // if true then license exists, we need to check for open issue to close
      let remove = true;
      console.log("sending request to remove issue");
      await checkForExistingIssue(owner, repo, context, remove);
    } else {
      console.log("creating github issue if none exist");
      await createGithubIssue(owner, repo, context);
    }
  });

  const path = require("path")
  // const getRouter = require("probot/lib/get-router");
  const router = app.getRouter("/");

  // Use any middleware
  router.use(require("express").static(path.join(__dirname + "/public")));

  router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });

  // Add a new route
  router.get("/privacy-policy", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/privacy.html"));
  });

  router.get("/support", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/support.html"));
  });

  // app.use(router);

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
