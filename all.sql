--
-- 	Database Table Creation
--

drop table student cascade constraints;
drop table faculty cascade constraints;
drop table class cascade constraints;
drop table enrolled cascade constraints;
drop table emp cascade constraints;
drop table works cascade constraints;
drop table dept cascade constraints;
drop table flights cascade constraints;
drop table aircraft cascade constraints;
drop table certified cascade constraints;
drop table employees cascade constraints;
drop table suppliers cascade constraints;
drop table parts cascade constraints;
drop table catalog cascade constraints;
drop table sailors cascade constraints;
drop table boats cascade constraints;
drop table reserves cascade constraints;

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
	numSeatInParliament int
);

create table PoliticalParty2 (
	ideology varchar2 (50) primary key,
	votingBlocSize int
);

create table PoliticalParty3 (
	numSeatInParliament int primary key,
	status varchar2(50)
);

create table CandidatePartyMembership1 (
	candidateName varchar2 (50) primary key,
	birthDate date,
	sex char (1), --M/F/N
	partyName varchar2 (50),
	dateJoined date
);

create table CandidatePartyMembership2 (
	birthDate date primary key,
	age int,
	
);

create table ElectionWin (
	electionYear year,
	districtName varchar2 (50),
	winner varchar2 (50),
	primary key (electionYear, districtName),
	foreign key (districtName) references ElectoralDistrict1,
	foreign key (winner) references CandidatePartyMembership1 (candidateName)
);

create table Elect (
	candidateName varchar2 (50),
	electionYear year,
	districtName varchar2 (50),
	ballotCount int,
	primary key (candidateName, electionYear, districtName),
	foreign key (candidateName) references CandidatePartyMembership1,
	foreign key (electionYear) references ElectionWin,
	foreign key (districtName) references ElectoralDistrict1
);

create table MPGenerate1 (
	mpName varchar2 (50),
	seatNumber int,
	districtName varchar2 (50),
	electionYear year,
	primary key (mpName, districtName, electionYear),
	foreign key (districtName) references ElectoralDistrict1,
	foreign key (electionYear) references ElectionWin
);

create table MPGenerate2 (
	electionYear year primary key,
	term int
);

create table PrimeMinister (
	pmName varchar2 (50) primary key,
	num int,
	ministry varchar2 (50),
	foreign key (pmName) references MPGenerate1 (mpName)
);

create table CabinetMember (
	cmName varchar2 (50) primary key,
	ministry varchar2 (50),
	foreign key (cmName) references MPGenerate1 (mpName)
);

create table ParliamentaryGroup (
	parliamentaryGroupName varchar2 (50) primary key,
	yearFounded year
);

create table SenatorRecommendParliamentaryGroupMembership1 (
	senatorName varchar2 (50) primary key,
	birthDate date,
	sex char (3), --M/F/N
	recommendedPMName varchar2 (50) not null,
	parliamentaryGroupName varchar2 (50),
	appointmentDate date,
	foreign key (recommendedPMName) references PrimeMinister (pmName),
	foreign key (parliamentaryGroupName) references ParliamentaryGroup
);

create table SenatorRecommendParliamentaryGroupMembership2 (
	birthDate date primary name,
	age int
);

create table Affiliate (
	partyName varchar2 (50),
	parliamentaryGroupName varchar2 (50),
	primary key (partyName, parliamentaryGroupName)
)

create table Committee (
	committeeName varchar (50) primary key,
	type varchar (50)
);

create table CommitteeMembership (
	mpName varchar (50),
	committeeName varchar (50),
	primary key (mpName, committeeName),
	foreign key (mpName) references MPGenerate1,
	foreign key (committeeName) references Committee
);

create table BillIntroduce1 (
	billNumber int primary key,
	title varchar2 (255),
	introducer varchar (50) not null,
	dateIntroduced date,
	foreign key (introducer) references MPGenerate1 (mpName)
);

create table BillIntroduce2 (
	title varchar2 (255) primary key,
	content text
);

create table Amend (
	committeeName varchar2 (50),
	billNumber int,
	primary key (committeeName, billNumber)
)

create table SenatorVote (
	billNumber int,
	senatorName varchar (50),
	vote boolean,
	primary key (billNumber, senatorName),
	foreign key (billNumber) references BillIntroduce1,
	foreign key (senatorName) references SenatorRecommendParliamentaryGroupMembership1
);

create table MPVote (
	billNumber int,
	mpName varchar (50),
	vote boolean,
	primary key (billNumber, mpName),
	foreign key (billNumber) references BillIntroduce1,
	foreign key (mpName) references MPGenerate1
);

--
-- done adding all of the tables, now add in some tuples
--
