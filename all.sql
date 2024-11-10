--
-- 	Database Table Creation
--

drop table ElectoralDistrict1 cascade constraints;
drop table ElectoralDistrict2 cascade constraints;
drop table PoliticalParty1 cascade constraints;
drop table PoliticalParty2 cascade constraints;
drop table PoliticalParty3 cascade constraints;
drop table CandidatePartyMembership1 cascade constraints;
drop table CandidatePartyMembership2 cascade constraints;
drop table ElectionWin cascade constraints;
drop table Elect cascade constraints;
drop table MemberOfParliament cascade constraints;
drop table Form1 cascade constraints;
drop table Form2 cascade constraints;
drop table PrimeMinister cascade constraints;
drop table CabinetMember cascade constraints;
drop table ParliamentaryGroup cascade constraints;
drop table SenatorRecommendParliamentaryGroupMembership1 cascade constraints;
drop table SenatorRecommendParliamentaryGroupMembership2 cascade constraints;
drop table Affiliate cascade constraints;
drop table Committee cascade constraints;
drop table CommitteeMembership cascade constraints;
drop table BillIntroduce1 cascade constraints;
drop table BillIntroduce2 cascade constraints;
drop table Amend cascade constraints;
drop table SenatorVote cascade constraints;
drop table MPVote cascade constraints;

--
-- Constants
--



--
-- Now, add each table.
--
create table ElectoralDistrict1 (
	districtName varchar2 (50) primary key,
	province char (2), --AB/BC/MB/NB/NL/NT/NS/NU/ON/PE/QC/SK/YT
	population int
);

create table ElectoralDistrict2 (
	population int primary key,
	districtCategory varchar2 (50)
);

create table PoliticalParty1 (
	partyName varchar2 (50) primary key,
	ideology varchar2 (50),
	dateRegistered date,
	numSeatsInParliament int
);

create table PoliticalParty2 (
	ideology varchar2 (50) primary key,
	votingBlocSize int
);

create table PoliticalParty3 (
	numSeatsInParliament int primary key,
	status varchar2(50)
);

create table CandidatePartyMembership1 (
	candidateName varchar2 (50) primary key,
	birthDate date,
	sex char (1), --M/F/N
	partyName varchar2 (50),
	dateJoined date,
	foreign key (partyName) references PoliticalParty1
);

create table CandidatePartyMembership2 (
	birthDate date primary key,
	age int
);

create table ElectionWin (
	electionYear number (4),
	districtName varchar2 (50),
	winner varchar2 (50),
	primary key (electionYear, districtName),
	foreign key (districtName) references ElectoralDistrict1,
	foreign key (winner) references CandidatePartyMembership1 (candidateName)
);

create table Elect (
	candidateName varchar2 (50),
	electionYear number (4),
	districtName varchar2 (50),
	ballotCount int,
	primary key (candidateName, electionYear, districtName),
	foreign key (candidateName) references CandidatePartyMembership1,
	foreign key (electionYear, districtName) references ElectionWin (electionYear, districtName)
);

create table MemberOfParliament (
	mpName varchar2 (50) primary key,
	seatNumber int
);

create table Form1 (
	mpName varchar2 (50),
	electionYear number (4),
	districtName varchar2 (50),
	primary key (mpName, electionYear, districtName),
	foreign key (mpName) references MemberOfParliament,
	foreign key (electionYear, districtName) references ElectionWin (electionYear, districtName)
);

create table Form2 (
	electionYear number (4),
	districtName varchar2 (50),
	num int,
	primary key (electionYear, districtName),
	foreign key (electionYear, districtName) references ElectionWin (electionYear, districtName)
);

create table PrimeMinister (
	pmName varchar2 (50) primary key,
	num int,
	ministry varchar2 (50),
	foreign key (pmName) references MemberOfParliament
);

create table CabinetMember (
	cmName varchar2 (50) primary key,
	ministry varchar2 (50),
	foreign key (cmName) references MemberOfParliament
);

create table ParliamentaryGroup (
	parliamentaryGroupName varchar2 (50) primary key,
	dateFounded date
);

create table SenatorRecommendParliamentaryGroupMembership1 (
	senatorName varchar2 (50) primary key,
	birthDate date,
	sex char (1), --M/F/N
	recommendedPMName varchar2 (50) not null,
	parliamentaryGroupName varchar2 (50),
	appointmentDate date,
	foreign key (recommendedPMName) references PrimeMinister (pmName),
	foreign key (parliamentaryGroupName) references ParliamentaryGroup
);

create table SenatorRecommendParliamentaryGroupMembership2 (
	birthDate date primary key,
	age int
);

create table Affiliate (
	partyName varchar2 (50),
	parliamentaryGroupName varchar2 (50),
	primary key (partyName, parliamentaryGroupName)
);

create table Committee (
	committeeName varchar (50) primary key,
	type varchar (50)
);

create table CommitteeMembership (
	mpName varchar (50),
	committeeName varchar (50),
	primary key (mpName, committeeName),
	foreign key (mpName) references MemberOfParliament,
	foreign key (committeeName) references Committee
);

create table BillIntroduce1 (
	billNumber int primary key,
	title varchar2 (255),
	introducer varchar (50) not null,
	dateIntroduced date,
	foreign key (introducer) references MemberOfParliament (mpName)
);

create table BillIntroduce2 (
	title varchar2 (255) primary key,
	content varchar2 (1000)
);

create table Amend (
	committeeName varchar2 (50),
	billNumber int,
	primary key (committeeName, billNumber),
	foreign key (committeeName) references Committee,
	foreign key (billNumber) references BillIntroduce1
);

create table SenatorVote (
	billNumber int,
	senatorName varchar (50),
	vote char(1), --y/n/a
	primary key (billNumber, senatorName),
	foreign key (billNumber) references BillIntroduce1,
	foreign key (senatorName) references SenatorRecommendParliamentaryGroupMembership1
);

create table MPVote (
	billNumber int,
	mpName varchar (50),
	vote char(1), --y/n/a
	primary key (billNumber, mpName),
	foreign key (billNumber) references BillIntroduce1,
	foreign key (mpName) references MemberOfParliament
);

--
-- done adding all of the tables, now add in some tuples
--
