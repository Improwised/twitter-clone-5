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
-- Name: tbl_tweet_t_id_seq; Type: SEQUENCE; Schema: public; Owner: riddhi
--

CREATE SEQUENCE tbl_tweet_t_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tbl_tweet_t_id_seq OWNER TO riddhi;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: tbl_tweet; Type: TABLE; Schema: public; Owner: riddhi
--

CREATE TABLE tbl_tweet (
    t_id integer DEFAULT nextval('tbl_tweet_t_id_seq'::regclass) NOT NULL,
    "t_tweetText" text,
    "t_likeCount" integer,
    t_time timestamp without time zone DEFAULT '2017-01-19 13:01:27.066544'::timestamp without time zone,
    t_username text
);


ALTER TABLE tbl_tweet OWNER TO riddhi;

--
-- Data for Name: tbl_tweet; Type: TABLE DATA; Schema: public; Owner: riddhi
--

COPY tbl_tweet (t_id, "t_tweetText", "t_likeCount", t_time, t_username) FROM stdin;
\.


--
-- Name: tbl_tweet_t_id_seq; Type: SEQUENCE SET; Schema: public; Owner: riddhi
--

SELECT pg_catalog.setval('tbl_tweet_t_id_seq', 1, false);


--
-- Name: tbl_tweet tbl_tweet_pkey; Type: CONSTRAINT; Schema: public; Owner: riddhi
--

ALTER TABLE ONLY tbl_tweet
    ADD CONSTRAINT tbl_tweet_pkey PRIMARY KEY (t_id);


--
-- PostgreSQL database dump complete
--

