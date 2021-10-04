/* eslint-disable ember/new-module-imports */
import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
  async model() {
    let response = await fetch('https://api.october.eu/projects');
    let data = await response.json();

    let projects = data.projects;

    let onlineProjectCount = 0;

    let parsedProjects = projects.map((project) => {
      if (project.status == 'online') {
        onlineProjectCount++;
      }

      let {
        name,
        status,
        id,
        rate,
        summary,
        illustration,
        amount,
        grade,
        onlineDate,
        loanDuration,
      } = project;

      let summary_en = summary.en[0].value;

      let image = 'https://cdn.october.eu/' + illustration.url;

      let projectStartedDuration = getProjectStartedDuration(onlineDate);

      return {
        name,
        status,
        id,
        rate,
        summary_en,
        image,
        grade,
        amount,
        projectStartedDuration,
        loanDuration,
      };
    });

    return { parsedProjects, onlineProjectCount };
  },
});

function getProjectStartedDuration(projectOnlineDate) {
  let durationFormats = ['day', 'days', 'month', 'months', 'year', 'years'];
  let now = moment();
  let formattedOnlineDate = moment(projectOnlineDate);
  let projectStartedDuration = now.diff(formattedOnlineDate, 'days');
  let postFixValue =
    projectStartedDuration > 1 ? durationFormats[1] : durationFormats[0];

  if (projectStartedDuration > 30) {
    projectStartedDuration = now.diff(formattedOnlineDate, 'months');
    postFixValue =
      projectStartedDuration > 1 ? durationFormats[3] : durationFormats[2];

    if (projectStartedDuration > 12) {
      projectStartedDuration = now.diff(formattedOnlineDate, 'years');
      postFixValue =
        projectStartedDuration > 1 ? durationFormats[5] : durationFormats[4];
    }
  }

  return projectStartedDuration + ' ' + postFixValue;
}
