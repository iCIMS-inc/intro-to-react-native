import {
  BASE_URL,
  COMPANY_ID,
  API_KEY
} from 'react-native-dotenv';

// Use react-native-dotenv so you don't put your api keys in a public repo
// Make sure to add "react-native-dotenv" to .babelrc presets
const baseUrl = BASE_URL;
const companyId = COMPANY_ID;
const apiKey = API_KEY;

// FOR REFERENCES LOOK AT: https://hackicims.com

async function getJobById(jobId) {
  const response = await fetch(baseUrl + companyId + '/jobs/' + jobId, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + apiKey
    }
  });

  return await response.json();
}

module.exports = {
  /**      
   * This function fetches all applications from API.
   * It then grabs all the jobs and people associated with each application.
   * Make sure to only grab the job and people once.
   * We'll end up with a structure like:
   * jobs = [
   *    {
   *      id: 123,
   *      title: 'Example Job I'
   *      applications: [
   *        id: 321,
   *        jobId: 123,
   *        personId: 111,
   *        person: {
   *          id: 111,
   *          firstName: 'John',
   *          lastName: 'Snow'
   *        }
   *      ]
   *    }
   * ]
   */
  getAllApplications: async (limitTo) => {
    try {
      limitTo = limitTo || 10000; // Limit jobs to

      // Request all Applicatoins
      const response = await fetch(baseUrl + companyId + '/applications', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + apiKey
        }
      });

      // Build from JSON
      let applications =  await response.json();  

      // Slicing the amount of applications we want to limit to
      applications = applications.slice(0, limitTo); 

      // We will store all jobs here so we don't make more than 1 request per job
      let jobs = new Map(); 

      // For each application, make sure we create exactly one entry per job and person 
      // associated to that application in the jobs and people HashMaps.
      // Note that we have two-way relationships. In this case job --HAS_MANY--> [applications]
      applications.forEach((application) => {
        if (jobs.has(application.jobId)) {
          // If we encounter a job that is already in the HashMap, just push this application in the array
          jobs.get(application.jobId).applications.push(application);
        } else {
          // If this job was not in the HashMap, set its entry
          jobs.set(application.jobId, {
            'applications': [application]
          });
        }
      });

      // Create an array from jobs.keys().
      // For each jobId that we have, request its information to API
      const jobRequests = Array.from(jobs.keys()).map((jobId) => {
        return new Promise(async (resolve, reject) => {
          try {
            const job = await getJobById(jobId);
            jobs.get(jobId).id = job.id;
            jobs.get(jobId).title = job.title;

            resolve(); // we're done here
          } catch (error) {
            reject(error); // there was an error, throw exception
          }
        });
      });


      // Promise.all() so that we wait for all Jobs and People requests to finish
      await Promise.all(jobRequests/*.concat(peopleRequests)*/);

      // Return all jobs
      return Array.from(jobs.values());
    } catch (error) {
      throw error;
    }
  },
  getPersonById: async (personId) => {
    const response = await fetch(baseUrl + companyId + '/people/' + personId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + apiKey
      }
    });

    return await response.json();
  }
}