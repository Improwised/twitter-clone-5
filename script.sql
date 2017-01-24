--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: tbl_login; Type: TABLE; Schema: public; Owner: riddhi
--

CREATE TABLE tbl_login (
    l_id integer NOT NULL,
    l_email text,
    l_pass character varying
);


ALTER TABLE tbl_login OWNER TO riddhi;

--
-- Name: tbl_login_l_id_seq; Type: SEQUENCE; Schema: public; Owner: riddhi
--

CREATE SEQUENCE tbl_login_l_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tbl_login_l_id_seq OWNER TO riddhi;

--
-- Name: tbl_login_l_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: riddhi
--

ALTER SEQUENCE tbl_login_l_id_seq OWNED BY tbl_login.l_id;


--
-- Name: tbl_tweet; Type: TABLE; Schema: public; Owner: riddhi
--

CREATE TABLE tbl_tweet (
    t_id integer NOT NULL,
    "t_tweetText" text,
    "t_likeCount" integer,
    t_time timestamp without time zone DEFAULT '2017-01-19 13:01:27.066544'::timestamp without time zone
);


ALTER TABLE tbl_tweet OWNER TO riddhi;

--
-- Name: tbl_tweet_t_id_seq; Type: SEQUENCE; Schema: public; Owner: riddhi
--

CREATE SEQUENCE tbl_tweet_t_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tbl_tweet_t_id_seq OWNER TO riddhi;

--
-- Name: tbl_tweet_t_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: riddhi
--

ALTER SEQUENCE tbl_tweet_t_id_seq OWNED BY tbl_tweet.t_id;


--
-- Name: tbl_login l_id; Type: DEFAULT; Schema: public; Owner: riddhi
--

ALTER TABLE ONLY tbl_login ALTER COLUMN l_id SET DEFAULT nextval('tbl_login_l_id_seq'::regclass);


--
-- Name: tbl_tweet t_id; Type: DEFAULT; Schema: public; Owner: riddhi
--

ALTER TABLE ONLY tbl_tweet ALTER COLUMN t_id SET DEFAULT nextval('tbl_tweet_t_id_seq'::regclass);


--
-- Data for Name: tbl_login; Type: TABLE DATA; Schema: public; Owner: riddhi
--

COPY tbl_login (l_id, l_email, l_pass) FROM stdin;
\.


--
-- Name: tbl_login_l_id_seq; Type: SEQUENCE SET; Schema: public; Owner: riddhi
--

SELECT pg_catalog.setval('tbl_login_l_id_seq', 1, false);


--
-- Data for Name: tbl_tweet; Type: TABLE DATA; Schema: public; Owner: riddhi
--

COPY tbl_tweet (t_id, "t_tweetText", "t_likeCount", t_time) FROM stdin;
1	abc	\N	2017-01-19 13:01:27.066544
160	aaa	12	2017-01-23 12:18:09.998644
161	Riddhi	0	2017-01-23 13:42:30.27655
162	Ankita	0	2017-01-24 05:10:23.853523
163	aaabbbbccc	0	2017-01-24 05:11:17.11665
164	zzz	0	2017-01-24 05:12:45.955474
165	xxx	0	2017-01-24 05:14:16.611531
166	RIDDHI	0	2017-01-24 05:14:57.530019
\.


--
-- Name: tbl_tweet_t_id_seq; Type: SEQUENCE SET; Schema: public; Owner: riddhi
--

SELECT pg_catalog.setval('tbl_tweet_t_id_seq', 196, true);


--
-- Name: tbl_login tbl_login_pkey; Type: CONSTRAINT; Schema: public; Owner: riddhi
--

ALTER TABLE ONLY tbl_login
    ADD CONSTRAINT tbl_login_pkey PRIMARY KEY (l_id);


--
-- Name: tbl_tweet tbl_tweet_pkey; Type: CONSTRAINT; Schema: public; Owner: riddhi
--

ALTER TABLE ONLY tbl_tweet
    ADD CONSTRAINT tbl_tweet_pkey PRIMARY KEY (t_id);


--
-- PostgreSQL database dump complete
--

