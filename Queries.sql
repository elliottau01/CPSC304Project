-- 2.1.7 Aggregation with GROUP BY
-- Count the number of winning candidates grouped by party

SELECT M.partyName, COUNT(*) AS numWinners
FROM CandidatePartyMembership M
JOIN ElectionWin W ON M.candidateName = W.winner
GROUP BY M.partyName;

-- 2.1.8 Aggregation with HAVING
-- Show the party that has official status (having 12 seats or above)

SELECT partyName 
FROM PoliticalParty1
GROUP BY partyName
HAVING MAX(numSeatsInParliament) >= 12

-- 2.1.9 Nested Aggregation with GROUP BY 
-- Calculates the difference in votes between the candidate with the most votes and the candidate with the fewest votes for each district and election year.

SELECT districtName, electionYear, MAX(VoteDifference) AS MaxVoteDifference
FROM (
	SELECT districtName, electionYear, MAX(VotesObtained) - MIN(VotesObtained) AS VoteDifference
    FROM Elect
    GROUP BY districtName, electionYear
) AS AggregatedVotes
GROUP BY districtName, electionYear;

-- 2.1.10 Division
-- Show the political parties having at least one candidate for all electoral districts in BC during the 2024 election.

SELECT partyName
FROM PoliticalParty P
WHERE NOT EXIST
	((SELECT districtName
	FROM ElectoralDistrict ED
	WHERE province==”British Columbia”)
	MINUS
	(SELECT D.districtName
	 FROM Elect E, CandidatePartyMembership CPM, ElectoralDistrict D
	 WHERE E.districtName == D.districtName, E.candidateName == CPM.candidateName, P.partyName == CPM.partyName)
	);

