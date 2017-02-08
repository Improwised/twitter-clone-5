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

--
-- Name: tbl_follower_f_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tbl_follower_f_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tbl_follower_f_id_seq OWNER TO "postgres";

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: tbl_follower; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE tbl_follower (
    f_id integer DEFAULT nextval('tbl_follower_f_id_seq'::regclass) NOT NULL,
    f_userid integer,
    f_followerid integer
);


ALTER TABLE tbl_follower OWNER TO "postgres";

--
-- Name: tbl_register_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tbl_register_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tbl_register_id_seq OWNER TO "postgres";

--
-- Name: tbl_register; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE tbl_register (
    id integer DEFAULT nextval('tbl_register_id_seq'::regclass) NOT NULL,
    fullname text,
    emailid text,
    password text,
    image text,
    securityquestion text,
    securityanswer text
);


ALTER TABLE tbl_register OWNER TO "postgres";

--
-- Name: tbl_tweet_t_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tbl_tweet_t_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tbl_tweet_t_id_seq OWNER TO "postgres";

--
-- Name: tbl_tweet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE tbl_tweet (
    t_id integer DEFAULT nextval('tbl_tweet_t_id_seq'::regclass) NOT NULL,
    "t_tweetText" text,
    t_time timestamp without time zone DEFAULT '2017-01-19 13:01:27.066544'::timestamp without time zone,
    t_userid integer,
    "t_likeCount" integer,
    t_image text
);


ALTER TABLE tbl_tweet OWNER TO "postgres";

--
-- Data for Name: tbl_follower; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tbl_follower (f_id, f_userid, f_followerid) FROM stdin;
\.


--
-- Name: tbl_follower_f_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tbl_follower_f_id_seq', 21, true);


--
-- Data for Name: tbl_register; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tbl_register (id, fullname, emailid, password, image, securityquestion, securityanswer) FROM stdin;
\.


--
-- Name: tbl_register_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tbl_register_id_seq', 16, true);


--
-- Data for Name: tbl_tweet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tbl_tweet (t_id, "t_tweetText", t_time, t_userid, "t_likeCount", t_image) FROM stdin;
\.


--
-- Name: tbl_tweet_t_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tbl_tweet_t_id_seq', 131, true);


--
-- Name: tbl_follower tbl_follower_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tbl_follower
    ADD CONSTRAINT tbl_follower_pkey PRIMARY KEY (f_id);


--
-- Name: tbl_register tbl_register_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tbl_register
    ADD CONSTRAINT tbl_register_pkey PRIMARY KEY (id);


--
-- Name: tbl_tweet tbl_tweet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tbl_tweet
    ADD CONSTRAINT tbl_tweet_pkey PRIMARY KEY (t_id);


--
-- PostgreSQL database dump complete
--

