/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const checkForExistingIssue = async (owner, repo, context, remove) => {
  try {
    // Fetch all open issues on Github Repo
    app.log("Fetching Github Issues");
    const issueList = await context.octokit.rest.issues.listForRepo({
      owner,
      repo,
    });

    for (const issue of issueList.data) {
      // If github title matches Bot title, return true
      // Close issue if remove === true
      if (issue.title === "No License") {
        const issue_number = issue.number;
        app.log.info("closing: " + issue_number);
        if (remove) {
          app.log.info("closing github issue");
          try {
            let closeIssue = await context.octokit.rest.issues.update({
              owner,
              repo,
              issue_number,
              state: "closed",
            });
            app.log.info("Issue should be closed");
          } catch (error) {
            app.log.info("There was a problem closing the Github issue");
            app.log.info(error);
          }
        }
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    app.log.info("Error fetch Github Issues");
  }
};

const createGithubIssue = async (owner, repo, context) => {
  let existingIssue = await checkForExistingIssue(owner, repo, context);
  if (!existingIssue) {
    //If false, no existing issue on missing License.
    try {
      app.log.info("Opening Issue. User repo does not have license");
      const repoIssue = await context.octokit.rest.issues.create({
        owner,
        repo,
        title: "No License",
        body: "Please add a license to your repository",
      });
    } catch (error) {
      app.log.info("There was an issue creating a Github Issue");
    }
  }
};

const checkRepoForLicense = async (owner, repo, context) => {
  try {
    app.log.info("Making license request");
    const license = await context.octokit.rest.licenses.getForRepo({
      owner,
      repo,
    });
    app.log.info("License was found");
    return true;
  } catch (error) {
    // No license was found
    app.log.info("No license found");
    return false;
  }
};

module.exports = (app) => {
  app.log.info("Yay, the app was loaded!");

  // Create a on installation listener that checks the repository for a License and opens an issue if it does not have one
  app.on("installation.created", async (context) => {
    const owner = context.payload.installation.account.login;
    const repo = context.payload.repositories[0].name;

    let status = await checkRepoForLicense(owner, repo, context);
    if (!status) {
      // create github issue if none exist
      app.log.info("Creating issue, no license detected.");
      await createGithubIssue(owner, repo, context);
    }
  });

  app.on("push", async (context) => {
    const owner = context.payload.repository.owner.name;
    const repo = context.payload.repository.name;

    let status = await checkRepoForLicense(owner, repo, context);
    app.log.info(status);
    if (status) {
      // if true then license exists, we need to check for open issue to close
      let remove = true;
      app.log.info("remove existing issue");
      await checkForExistingIssue(owner, repo, context, remove);
    } else {
      app.log.info("creating github issue if none exist");
      await createGithubIssue(owner, repo, context);
    }
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
